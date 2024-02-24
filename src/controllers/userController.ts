import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

import * as Joi from "joi"

const prisma = new PrismaClient()

// create new user

interface UserInput {
  id: number
  email: string
  firstName: string
  lastName: string
  social?: {
    facebook?: string
    twitter?: string
    github?: string
    website?: string
  }
}

const createUser = async (req: Request, res: Response) => {
  const userInput: UserInput = req.body
  const { email, firstName, lastName, social } = userInput
  
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required().min(3),
    lastName   : Joi.string().required().min(3),
    social: Joi.object({
        facebook: Joi.string().uri() ,
        github: Joi.string().uri() ,
        twitter: Joi.string().uri() ,
        website: Joi.string().uri() ,
    })
  })
  
  const { error } = schema.validate(userInput )
  
  if(error) {
    return res.status(400).json({
        error: error.details[0].message
    })
  }

  try {
    const user = await prisma.user.create({
      data: { email, firstName, lastName, social },
    })
    
    res.status(201).json({
        "success": true , 
        user 
    })
  } catch (e) {
    // console.error(e)
    res.status(500).json({
      success: false,
      message:(e as Error).message ,
    })
  }

  res.json({
    yahoo: "OK",
  })
}

const getAllUsers = async (req: Request, res: Response) => {    
    const users = await prisma.user.findMany()
  res.json({
    "success" : true , 
    users     
  })
}
const getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      res.json(user)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: "Failed to get user" })
    }
}

export { createUser , getAllUsers , getUserById }
