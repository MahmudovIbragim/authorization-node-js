import { body } from "express-validator";

export const loginValidation = [
  body("email", "неверный формат").isEmail(),
  body("password", "пароль длиной 5 ").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "неверный формат").isEmail(),
  body("password", "пароль длиной 5 ").isLength({ min: 5 }),
  body("fullName", "укадите имя ").isLength({ min: 3 }),
  body("avatarUrl", "не верная ссаылка").optional().isURL(),
];

export const postCreatValidation = [
  body("title", "Введите заголовок").isLength({ min: 3 }).isString(),
  body("text", "Введите текс статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тегов").optional().isString(),
  body("imagUrl", "Неверная ссылка изображение").optional().isString(),
];
