import { Request, Response } from "express";
import crypto from 'crypto';
import con from '../../connection.ts'
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv'
dotenv.config()

export const getUrls = async (req: Request, res: Response) => {

  const query = 'SELECT * FROM Short_urls'
  const [rows] = await con.execute(query)
  res.status(StatusCodes.ACCEPTED).send(rows);
}


export const shortenUrl = async (req: Request, res: Response) => {

  const userId = req.user.id ? req.user.id : null
  const { originalUrl } = req.body
  if (!originalUrl) {
    res.status(StatusCodes.FORBIDDEN).send({ message: 'Original URL is required' });
  }

  try {
    const shortUrl = crypto.randomBytes(3).toString('hex');
    const query = `INSERT INTO Short_urls  VALUES (null,'${originalUrl}', '${shortUrl}', ${userId})`

    const [rows] = await con.execute(query)

    res.status(StatusCodes.ACCEPTED).send(`${process.env.HOST}:${process.env.PORT}/${shortUrl}`);
  }
  catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: err });
  }

}

async function getOriginalUrl(shortUrl: string) {
  const query = `SELECT su.link FROM Short_urls su WHERE su.short_link = '${shortUrl}'`
  const [rows] = await con.execute(query)

  return rows[0].link

}



async function countClicker(shortUrl: string, userId: number) {
  const query = `SELECT su.idurls, su.fk_users_short_urls as userId,tsu.total_clickers, tsu.total_access FROM Short_urls su 
                INNER JOIN Total_shortened_urls tsu
                on(idUrls =fk_short_url_total) 
                WHERE su.short_link = '${shortUrl}' AND fk_users_short_urls = ${userId}`
  const [rows] = await con.execute(query)
  const count = rows[0].total_clickers + 1
  const idUrls = rows[0].idUrls
  const query2 = `INSERT INTO total_shortened_urls (total_clickers, fk_short_url_total) VALUES (${count}, ${idUrls})`
  await con.execute(query2)
  return rows
}

export const redirectUrl = async (req: Request, res: Response) => {
  const shortUrl = req.params.id;
  const userId = req?.user?.id ? req.user.id : null
  try {
    let url = await getOriginalUrl(shortUrl)

    if (url) {
      res.redirect(StatusCodes.OK, url);
      //count click
      await countClicker(shortUrl,userId)
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Url not found' });
    }
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: err });
  }
};


async function getUrlByUserId(id: number) {
  const query = `SELECT su.link, su.short_link FROM Short_urls su WHERE su.fk_users_short_urls = '${id}'`
  const [rows] = await con.execute(query)

  return rows
}

export const list = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    let urls = await getUrlByUserId(id)
    res.status(StatusCodes.OK).send(urls);

  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: err });
  }
};
async function updateUrl(id: number, newLink: string) {

  const query = `UPDATE Short_urls SET link= '${newLink}' WHERE idurls = ${id}`
  try {
    return await con.execute(query)
  }
  catch (err) {
    return err
  }

}

//precisa verificar se o usuario esta fazendo update na sua url
export const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { newLink } = req.body
  try {
    let urls = await updateUrl(id, newLink)
    res.status(StatusCodes.OK).send(urls);

  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: err });
  }
};

//precisa verificar se o usuario esta deletando sua url

async function deleteUrlService(id: number) {

  const query = `DELETE FROM Short_urls WHERE idurls =${id}`
  try {
    return await con.execute(query)
  }
  catch (err) {
    return err
  }
}

export const deleteUrl = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    let urls = await deleteUrlService(id)
    res.status(StatusCodes.OK).send(urls);

  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: err });
  }
};

async function countAccess(shortUrl: string, userId: number) {
  const query = `SELECT su.idurls, su.fk_users_short_urls as userId,tsu.total_clickers, tsu.total_access FROM Short_urls su 
                INNER JOIN Total_shortened_urls tsu
                on(idUrls =fk_short_url_total) 
                WHERE su.short_link = '${shortUrl}' AND fk_users_short_urls = ${userId}`
  const [rows] = await con.execute(query)
  const count = rows[0].total_access + 1
  const idUrls = rows[0].idUrls
  const query2 = `INSERT INTO total_shortened_urls (total_access, fk_short_url_total) VALUES (${count}, ${idUrls})`
  await con.execute(query2)
  return rows
}


async function getOneUrl(id: number) {
  const query = `SELECT * from Short_urls su where su.idUrls ='${id}' limit 1 `
  const [rows] = await con.execute(query)
  return {"short_url": rows[0].short_link, "userId": rows[0].fk_users_short_urls, "link": rows[0].link}
}

export const url = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    let url = await getOneUrl(id)
    res.status(StatusCodes.OK).send(url);
    await countAccess(url.short_url, url.userId)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: err });
  }
};

