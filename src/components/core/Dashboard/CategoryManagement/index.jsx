import React from "react"
import CategoryCreation from "./CategoryCreation"

export default function CategoryManagement() {
  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">Category Management</h1>
      </div>
      <CategoryCreation />
    </div>
  )
}