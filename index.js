const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const SettingsBill = require("./settings-bill");
const moment = require("moment");

const app = express();
const settingsBill = SettingsBill();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.render("index", {
    setting: settingsBill.getSettings(),
    totals: settingsBill.totals(),
    total: settingsBill.grandTotalLevel(),
  });
});
app.post("/settings", function (req, res) {
  settingsBill.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel,
  });

  res.redirect("/");
});

app.post("/action", function (req, res) {
  settingsBill.recordAction(req.body.actionType);
  res.redirect("/");
});

app.get("/actions", function (req, res) {
  for (const item of settingsBill.actions()) {
    let nowMoment = item.date;
    item.timestamp = moment(nowMoment).fromNow();
  }
  res.render("actions", { actions: settingsBill.actions() });
});

app.get("/actions/:actionType", function (req, res) {
  for (const item of settingsBill.actions()) {
    let nowMoment = item.date;
    item.timestamp = moment(nowMoment).fromNow();
  }
  const actionType = req.params.actionType;

  res.render("actions", { actions: settingsBill.actionsFor(actionType) });
});

const PORT = process.env.PORT || 1007;

app.listen(PORT, function () {
  console.log("App started");
});
