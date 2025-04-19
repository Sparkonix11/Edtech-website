import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

// Add inline styles to ensure they persist after reload
const styles = {
  swiperContainer: {
    padding: "10px 0 40px 0",
    width: "100%",
    maxWidth: "100%"
  },
  reviewCard: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "220px",
    gap: "12px",
    backgroundColor: "#2C333F", // richblack-800
    padding: "16px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#F1F2FF", // richblack-25
    width: "100%",
    boxSizing: "border-box",
    overflow: "hidden" // Prevent text overflow
  },
  userInfoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    width: "100%"
  },
  userImage: {
    height: "36px",
    width: "36px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0 // Prevent image from shrinking
  },
  userInfoText: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden" // Prevent text overflow
  },
  userName: {
    fontWeight: "600", 
    color: "#F1F2FF", // richblack-5
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  courseName: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#838894", // richblack-500
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  reviewText: {
    fontWeight: "500",
    color: "#F1F2FF", // richblack-25
    flex: "1",
    overflow: "hidden" // Prevent text overflow
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "auto"
  },
  ratingValue: {
    fontWeight: "600",
    color: "#FFE83D" // yellow-100
  }
}

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const truncateWords = 15

  useEffect(() => {
    // Try to get reviews from localStorage first
    const cachedReviews = localStorage.getItem('cached_reviews')
    
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          setReviews(data?.data)
          // Cache the reviews in localStorage with expiration time (12 hours)
          const cacheData = {
            reviews: data?.data,
            timestamp: Date.now(),
            expiration: Date.now() + (12 * 60 * 60 * 1000) // 12 hours in milliseconds
          }
          localStorage.setItem('cached_reviews', JSON.stringify(cacheData))
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    if (cachedReviews) {
      try {
        const parsedCache = JSON.parse(cachedReviews)
        // Check if cache is still valid (not expired)
        if (parsedCache.expiration > Date.now()) {
          setReviews(parsedCache.reviews)
          setLoading(false)
        } else {
          // Cache expired, fetch fresh data
          fetchReviews()
        }
      } catch (error) {
        console.error("Error parsing cached reviews:", error)
        fetchReviews()
      }
    } else {
      fetchReviews()
    }
  }, [])

  return (
    <div className="text-white w-full">
      <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent mx-auto w-11/12">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="spinner"></div>
          </div>
        ) : reviews.length > 0 ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            freeMode={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            modules={[FreeMode, Pagination, Autoplay]}
            style={styles.swiperContainer}
          >
            {reviews.map((review, i) => {
              return (
                <SwiperSlide key={i} style={{width: "100%", minWidth: "200px"}}>
                  <div style={styles.reviewCard}>
                    <div style={styles.userInfoContainer}>
                      <img
                        src={
                          review?.user?.image
                            ? review?.user?.image
                            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName || ""} ${review?.user?.lastName || ""}`
                        }
                        alt="User"
                        style={styles.userImage}
                      />
                      <div style={styles.userInfoText}>
                        <h1 style={styles.userName}>{`${review?.user?.firstName || ""} ${review?.user?.lastName || ""}`}</h1>
                        <h2 style={styles.courseName}>
                          {review?.course?.courseName || ""}
                        </h2>
                      </div>
                    </div>
                    <p style={styles.reviewText}>
                      {review?.review && review.review.split(" ").length > truncateWords
                        ? `${review.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : `${review?.review || ""}`}
                    </p>
                    <div style={styles.ratingContainer}>
                      <h3 style={styles.ratingValue}>
                        {review?.rating ? review.rating.toFixed(1) : "0.0"}
                      </h3>
                      <ReactStars
                        count={5}
                        value={review?.rating || 0}
                        size={20}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        ) : (
          <div className="flex justify-center items-center h-[200px]">
            <p className="text-xl text-richblack-200">No reviews available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewSlider
