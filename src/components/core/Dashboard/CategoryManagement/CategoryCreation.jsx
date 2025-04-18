import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { createCategory, fetchCourseCategories } from "../../../../services/operations/courseDetailsAPI"
import IconBtn from "../../../Common/IconBtn"

export default function CategoryCreation() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCourseCategories()
        if (categoriesData) {
          setCategories(categoriesData)
        }
      } catch (error) {
        console.log("Error fetching categories:", error)
        toast.error("Failed to fetch categories")
      }
    }
    getCategories()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await createCategory(data, token)
      reset() // Reset form after successful submission
      // Refresh categories list
      const updatedCategories = await fetchCourseCategories()
      if (updatedCategories) {
        setCategories(updatedCategories)
      }
    } catch (error) {
      console.log("Error creating category:", error)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <h1 className="text-2xl font-semibold text-richblack-5">Create Category</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Category Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="name">
            Category Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="name"
            placeholder="Enter category name"
            {...register("name", { required: true })}
            className="form-style w-full"
            disabled={loading}
          />
          {errors.name && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Category name is required
            </span>
          )}
        </div>

        {/* Category Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="description">
            Category Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            id="description"
            placeholder="Enter category description"
            {...register("description", { required: true })}
            className="form-style min-h-[130px] w-full resize-x-none"
            disabled={loading}
          />
          {errors.description && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Category description is required
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <IconBtn
            disabled={loading}
            text={loading ? "Creating..." : "Create Category"}
          />
        </div>
      </form>

      {/* Category List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">Existing Categories</h2>
        {categories.length > 0 ? (
          <div className="rounded-md border-[1px] border-richblack-700 overflow-hidden">
            <table className="w-full text-richblack-100 border-collapse">
              <thead>
                <tr className="bg-richblack-700">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr 
                    key={category._id} 
                    className={`${index % 2 === 0 ? "bg-richblack-800" : "bg-richblack-700"} 
                             hover:bg-richblack-600 transition-all duration-200`}
                  >
                    <td className="p-4 border-t border-richblack-600">{category.name}</td>
                    <td className="p-4 border-t border-richblack-600">{category.description || "No description"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-richblack-300">No categories found</p>
        )}
      </div>
    </div>
  )
}