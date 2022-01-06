const Styles = `
  <head>
    <style>
      * {
        text-decoration: none;
        color: inherit;
      }
      .separator-top {
        border-top: 2px solid #212121;
      }
    </style>
  </head>
`

const OrderPreview = [
  '<p><b>Количество подарков:</b> ${model.order.amount} шт.</p>',
  '<p><b>Тип упаковки:</b> ${pkg.filter[0]}</p>',
  '<p><b>Упаковка для подарка:</b> ${pkg.name}</p>',
  // '<p><b>Доп. вложения:</b> [артикул], [артикул] (если несколько)</p>',
  '<p><b>Кол-во конфет:</b> ${sweets_amount} шт.</p>',
  '<p><b>Вес подарка:</b> ${model.order.filled} г.</p>',
  '<p><b>Цена подарка:</b> ${model.order.cost} руб.</p>',
  '<p><b>Сумма заказа:</b> ${(model.order.cost * model.order.amount).toFixed(2)} руб.</p>',
]

const SelfMessage = ['`',
  '<h3>Заявка ${model._id}</h3>',
  ...OrderPreview,
  '<h3>Информация о клиенте:</h3>',
  '<p><b>Имя:</b> ${model.user.name}</p>',
  '<p><b>Телефон:</b> ${model.user.phone}</p>',
  '<p><b>Почта:</b> ${model.user.email}</p>',
  '<p><b>Комментарий:</b> ${model.user.comment}</p>',
'`'].join('')

const ClientMessage = ['`',
  Styles,
  '<h2>Добрый день! Мы получили от Вас заявку на индивидуальный подарок.</h2>',
  '<h2>Режим работы менеджеров с 8:00 до 18:00, в ближайшее время с Вами свяжутся для подтверждения заказа.</h2>',
  '</br>',
  '<h3>Ниже представлены данные о Вашей заявке:</h3>',
  ...OrderPreview,
  '<h3>К сообщению приложен файл коммерческого предложения</h3>',
  '<h3 class="separator-top">kuzs.ru</h3>',
  '<h3>+7 (3843) 58-32-80</h3>',
  '<h3>+7 (913) 743-27-83</h3>',
'`'].join('')

const CompanyMessage = ['`',
  '<h1>CompanyMessage</h1>',
'`'].join('')

export {
  SelfMessage,
  ClientMessage,
  CompanyMessage,
}