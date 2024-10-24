import {Request,Response} from "express";

import con from '../../connection.ts'



export function getUrls(req:Request,res:Response){
    con.query('SELECT * FROM Short_urls ',(err,result)=>{
        if(err){
          res.send(err)
        }
        res.send(result)
      })
}