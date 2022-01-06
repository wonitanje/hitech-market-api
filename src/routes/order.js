require('dotenv').config()

import path from 'path'
import Router from 'express'
import nodemailer from 'nodemailer'
import Order from '../models/Order'
import { Package, Sweet, Attachment } from '../models/components'
import { SelfMessage, ClientMessage, CompanyMessage } from '../assets/email'
import Book from '../assets/excel'

const router = Router()
const root = path.join(__dirname, '../../')

router.get('/get-order/:id', async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id
  })

  res.status(200).send(order)
})

router.post('/save-order', async (req, res) => {
  const {
    order,
    basket,
    user
  } = req.body

  const find_options = Object.assign({
    'order.package': order.package,
    'order.filled': order.filled,
    'user.name': user.name || '',
    'user.phone': user.phone || '',
    'user.email': user.email || '',
    'user.comment': user.comment || '',
    'basket.attachment': basket.attachment
  },
    Object.fromEntries(
      Object.keys(basket.sweet)
        .map(id => [`basket.sweet.${id}.amount`, basket.sweet[id].amount])
    )
  )
  let model = await Order.findOne(find_options)

  if (!model) {
    const options = {
      order,
      basket,
      user
    }
    model = new Order(options, {})
    await model.save()
  }
  res.send(model._id)
})

router.post('/send-order/:id', async (req, res) => {
  const order_id = req.params.id
  const order_filename = `${order_id}.xlsx`
  const model = await Order.findOne({
    _id: order_id
  })

  if ((model.user.email || '').length == 0 && (model.user.phone || '').length == 0) {
    res.statusMessage = 'No email and no phone'
    return res.sendStatus(400)
  }

  const pkg = await Package.findOne({
    _id: model.order.package
  })
  const sweets_amount = Object.values(model.basket.sweet).reduce((sum, el) => sum + el.amount, 0)

  // Write xlsx
  const wb = await new Book('order.xlsx')
  wb.setSheet(wb.getSheets()[0])
  wb.writePackage(pkg.name, pkg.filter[0])
  wb.writeInfo((model.order.cost * model.order.amount).toFixed(2), model.order.filled)

  const sweet_promises = Object.entries(model.basket.sweet).map(async ([id, { amount }]) => {
    const sweet = await Sweet.findOne({ _id: id })
    for (let i = 0; i < amount; i++) {
      wb.insertSweet(sweet.name, sweet.sire, sweet.weight)
    }
  })
  const attach_promises = model.basket.attachment.map(async id => {
    const attach = await Attachment.findOne({ _id: id })
    wb.insertAttachment(attach.name)
  })

  await Promise.all([...sweet_promises, ...attach_promises])
  await wb.writeFile(order_filename)

  // Send mails
  const mailConfig = (process.env.NODE_ENV === 'production') ? {
    host: process.env.SMTP,
    port: process.env.SECURE,
    auth: {
      user: process.env.LOGIN,
      pass: process.env.PASSWD
    }
  } : {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'alexys.beahan42@ethereal.email',
      pass: 'nDXueM5bu2gkXJvU2e'
    }
  }

  console.log('mailConfig', mailConfig)
  console.log('root', root)
  const transporter = nodemailer.createTransport(mailConfig)

  const attachments = [{
    filename: 'Кузница Сладостей.xlsx',
    path: root + order_filename
  }]
  const SelfMail = {
    from: '"Кузница Сладостей" <wonitanje@kuzs.ru>',
    to: 'wonitanje@kuzs.ru',
    subject: 'Новый заказ в Кузнице Сладостей',
    html: eval(SelfMessage),
    attachments,
  }
  const ClientMail = {
    from: '"Кузница Сладостей" <wonitanje@kuzs.ru>',
    to: model.user.email,
    subject: 'Заказ в Кузнице Сладостей',
    html: eval(ClientMessage),
    attachments,
  }

  let sent = await transporter.sendMail(SelfMail)
    .then(() => true)
    .catch(() => false)
  if (!sent) {
    res.statusMessage = 'Self mail error'
    return res.sendStatus(400)
  }

  sent = await transporter.sendMail(ClientMail)
    .then(() => true)
    .catch(() => false)
  if (!sent) {
    res.statusMessage = 'Client mail error'
    return res.sendStatus(200)
  }

  res.statusMessage = 'OK'
  res.sendStatus(200)
})

module.exports = router