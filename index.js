import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.TELEGRAM_TOKEN;
const webAppUrl = process.env.WEB_APP_URL;

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(chatId, "Fill out the form using the button below", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Fill out the form",
              web_app: { url: webAppUrl + "/form" },
            },
          ],
        ],
      },
    });
    await bot.sendMessage(chatId, "Enter the store using the button below", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Make order", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      bot.sendMessage(chatId, "Thank you, we will contact you!");
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Success",
      input_message_contetnt: {
        message_text:
          "Congratulations on a successful purchaseCongratulations on a successful  purchase $" +
          totalPrice,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Something went wrong",
      input_message_contetnt: {
        message_text: "Something went wrong",
      },
    });
    return res.status(500).listenerCount({});
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log("Server working on PORT" + PORT));
