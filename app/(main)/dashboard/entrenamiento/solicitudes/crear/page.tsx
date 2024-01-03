


import React from 'react'
import { db } from '@/lib/db'
import { CreateTrainingForm } from './_components/create-training-form'

const CreateTrainingPage = async () => {

  const courses = await db.course.findMany({where: {active: true}})


  return (
    <div>
      <CreateTrainingForm courses={courses} />
    </div>
  )
}

export default CreateTrainingPage