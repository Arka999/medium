import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import {verify} from 'hono/jwt'
import {createBlogInput, updateBlogInput} from "@arkabanerjee999/medium-common1"

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
        JWT_SECRET: string
	},
    Variables:{
        userId: string;
    }
}>();

blogRouter.use('/*', async (c, next) =>{
    const authHeader=c.req.header("authorization") || "";
    try{
        const user = await verify(authHeader, c.env.JWT_SECRET)
        if(!user){
            c.status(401);
		    return c.json({ error: "unauthorized" });
        }
        c.set('userId', String(user.id));
	    await next()  
    }
    catch(e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }

    })
    
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const posts= await prisma.post.findMany({
        select:{
            content:true,
            title:true,
            id:true,
            author: {
                select:{
                    name:true
                }
            }
        }
    });
    return c.json({
        posts
    })
  })

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id= c.req.param("id");
    try{
        const post= await prisma.post.findFirst({
            where: {
                id: id
            },
            select:{
                id:true,
                title:true,
                content:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return c.json({
            post
        })
    } catch(e) {
        c.status(411);
        return c.json({
            message:"Error while fetching blogpost"
        });
    }
    
  })

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message:"Inputs not correct"
      })
    }
    const authorId=c.get("userId");
    const post= await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: authorId

        }
    })
    return c.json({
        id: post.id
    })
  })
blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message:"Inputs not correct"
      })
    }
    const post= await prisma.post.update({
        where:{
            id: body.id
        },
        data : {
            title: body.title,
            content: body.content,

        }
    })
    return c.json({
        id: post.id
    })
  })