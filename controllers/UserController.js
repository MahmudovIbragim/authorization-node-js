import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModal from "../models/User.js";

export const register = async (req, res) => {
  try {

    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModal({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user.id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "не удалось зарегестрроватся ",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModal.findOne({ email: req.body.email });

    if (!user) {
      return req.status(404).json({
        message: "пользватель не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "неверный пароль или почта",
      });
    }
    const token = jwt.sign(
      {
        _id: user.id,
      },
      "secret123",
      { expiresIn: "30d" }
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "не удалось войти ",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModal.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "пользвотель не найден ",
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "нет доступа ",
    });
  }
};
