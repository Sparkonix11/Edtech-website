import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints, courseEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

const { ENROLL_FREE_COURSE_API } = courseEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Processing...")
  dispatch(setPaymentLoading(true))
  try {
    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }

    // Check if it's a free course - in which case there will be no payment data
    if (!orderResponse.data.data) {
      toast.success("Successfully enrolled in the free course")
      navigate("/dashboard/enrolled-courses")
      dispatch(resetCart())
      toast.dismiss(toastId)
      dispatch(setPaymentLoading(false))
      return
    }

    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

    // For paid courses, load Razorpay and process payment
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      dispatch(setPaymentLoading(false))
      return
    }

    // Opening the Razorpay SDK
    const options = {
      key: process.env.RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "SkillPort",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
        verifyPayment({ ...response, courses }, token, navigate, dispatch)
      },
    }
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
      dispatch(setPaymentLoading(false))
    })
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error(error.message || "Could not make payment")
    dispatch(setPaymentLoading(false))
  }
  toast.dismiss(toastId)
}

// Enroll in a free course
export async function enrollInFreeCourse(courseId, token, navigate, dispatch) {
  const toastId = toast.loading("Enrolling in the course...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector(
      "POST",
      ENROLL_FREE_COURSE_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )

    console.log("FREE COURSE ENROLLMENT RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Successfully enrolled in the free course")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("FREE COURSE ENROLLMENT ERROR............", error)
    toast.error(error.message || "Failed to enroll in the free course")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...")
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment Successful. You are Added to the course ")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error("Could Not Verify Payment.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
