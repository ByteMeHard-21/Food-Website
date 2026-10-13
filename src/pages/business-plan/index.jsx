import { Link } from 'react-router-dom';
import { requestAI } from '../../lib/ai';
import { buildLocalPlan, localScenario, localCompetitors, localRoast } from '../../lib/planTemplates';
import { readLocal, writeLocal } from '../../lib/storage';
import { useState, useEffect, useRef } from "react";

// ── Fonts ────────────────────────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  `}</style>
);

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#0c1913", bgCard: "#13271d", bgCardHover: "#1b3327",
  accent: "#b9d58b", accentMuted: "#8ea773", accentBg: "#233923",
  cream: "#F5EDD8", muted: "#a0af99", border: "#294134", borderLight: "#3f5d49",
  success: "#3D8A5C", successBg: "#0D2018", error: "#C0392B", errorBg: "#1F0A08",
  text: "#F0E6D3", textSub: "#b2c0a9",
};

const globalCss = `
  .business-studio, .business-studio * { box-sizing: border-box; margin: 0; padding: 0; }
  .business-studio { background: ${T.bg}; color: ${T.text}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes countUp { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  .fade-up   { animation: fadeUp 0.5s ease forwards; }
  .fade-up-1 { animation: fadeUp 0.5s 0.05s ease both; }
  .fade-up-2 { animation: fadeUp 0.5s 0.10s ease both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.15s ease both; }
  .fade-up-4 { animation: fadeUp 0.5s 0.20s ease both; }
  .img-shimmer {
    background: linear-gradient(90deg, #1b3327 25%, #294134 50%, #1b3327 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
`;

  // ── TheMealDB + Unsplash fallback image system ───────────────────────────────
  // const MEAL_CACHE = {};

  // async function getMealDBImage(foodName) {
  //   const key = foodName.toLowerCase().trim();
  //   if (MEAL_CACHE[key]) return MEAL_CACHE[key];
  //   try {
  //     // Try exact search first
  //     const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(key)}`);
  //     const data = await res.json();
  //     if (data.meals && data.meals[0]?.strMealThumb) {
  //       const url = data.meals[0].strMealThumb + "/preview";
  //       MEAL_CACHE[key] = url;
  //       return url;
  //     }
  //     // Try first word only
  //     const firstWord = key.split(" ")[0];
  //     if (firstWord !== key) {
  //       const res2 = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(firstWord)}`);
  //       const data2 = await res2.json();
  //       if (data2.meals && data2.meals[0]?.strMealThumb) {
  //         const url = data2.meals[0].strMealThumb + "/preview";
  //         MEAL_CACHE[key] = url;
  //         return url;
  //       }
  //     }
  //   } catch (_) {}
  //   // Unsplash fallback
  //   const url = `https://source.unsplash.com/400x300/?${encodeURIComponent(foodName + " food dish")}`;
  //   MEAL_CACHE[key] = url;
  //   return url;
  // }

  // Hardcoded fallback for instant display while async loads
// 🔥 BIG KEYWORD-BASED DATASET
// 🔥 BIG KEYWORD-BASED DATASET (200+ Items)
const FOOD_IMAGES_STATIC = {
  // 🍛 INDIAN CURRIES & MAINS
  "paneer butter masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  "kadai paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  "palak paneer": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "matar paneer": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "chana masala": "https://images.unsplash.com/photo-1626132647523-66c8b36ec576?w=400&q=80",
  "aloo gobi": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  "bhindi masala": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "baingan bharta": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "malai kofta": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80",
  "dal makhani": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "dal tadka": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "rajma chawal": "https://images.unsplash.com/photo-1626500155539-936d9d0eeb53?w=400&q=80",
  "kadhi pakora": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
  "chicken tikka masala": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "butter chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "tandoori chicken": "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80",
  "mutton curry": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "rogan josh": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "fish curry": "https://images.unsplash.com/photo-1545580008-0112fb9c5d19?w=400&q=80",
  "egg curry": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",

  // 🍚 RICE & BREADS
  "jeera rice": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80",
  "veg biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "chicken biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "mutton biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "pulao": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80",
  "khichdi": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "tandoori roti": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "rumali roti": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "butter naan": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
  "garlic naan": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
  "aloo paratha": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "paneer paratha": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "gobi paratha": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "lachha paratha": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "puri": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "bhatura": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
  "missi roti": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",

  // 🥥 SOUTH INDIAN
  "masala dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
  "rava dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
  "neer dosa": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
  "idli": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "medu vada": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "dahi vada": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "uttapam": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
  "sambar": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "rasam": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",
  "upma": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "poha": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "lemon rice": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80",
  "curd rice": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "appam": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80",
  "puttu": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80",

  // 🌶️ INDIAN STREET FOOD & SNACKS
  "pani puri": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "golgappa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "bhel puri": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "sev puri": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "dahi puri": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "papdi chaat": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "aloo tikki": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "kachori": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
  "pakora": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
  "pav bhaji": "https://images.unsplash.com/photo-1619193099598-6856ec4e2a87?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "vada pav": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "misal pav": "https://images.unsplash.com/photo-1626132647523-66c8b36ec576?w=400&q=80",
  "dabeli": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&q=80",
  "kathi roll": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  "frankie": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  "mirchi bajji": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
  "dhokla": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
  "khandvi": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",

  // 🍬 INDIAN SWEETS
  "gulab jamun": "https://images.unsplash.com/photo-1601303516561-c8a77a75b9e1?w=400&q=80",
  "rasgulla": "https://images.unsplash.com/photo-1601303516561-c8a77a75b9e1?w=400&q=80",
  "rasmalai": "https://images.unsplash.com/photo-1601303516561-c8a77a75b9e1?w=400&q=80",
  "kaju katli": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "barfi": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "peda": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "motichoor laddu": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "besan laddu": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "jalebi": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "soan papdi": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "ghevar": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "phirni": "https://images.unsplash.com/photo-1601303516561-c8a77a75b9e1?w=400&q=80",
  "kheer": "https://images.unsplash.com/photo-1601303516561-c8a77a75b9e1?w=400&q=80",
  "gajar ka halwa": "https://images.unsplash.com/photo-1601303516561-c8a77a75b9e1?w=400&q=80",
  "moong dal halwa": "https://images.unsplash.com/photo-1601303516561-c8a77a75b9e1?w=400&q=80",

  // 🥢 ASIAN (Chinese / Japanese / Thai / Korean)
  "sushi": "https://images.unsplash.com/photo-1579871494447-08e1bf379e82?w=400&q=80",
  "sashimi": "https://images.unsplash.com/photo-1579871494447-08e1bf379e82?w=400&q=80",
  "maki": "https://images.unsplash.com/photo-1579871494447-08e1bf379e82?w=400&q=80",
  "ramen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  "udon": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  "soba": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  "pad thai": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&q=80",
  "green curry": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "red curry": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
  "dim sum": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "momos": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "spring rolls": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
  "bao buns": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "peking duck": "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80",
  "kung pao chicken": "https://images.unsplash.com/photo-1627308594190-a1b79df2d67d?w=400&q=80",
  "mapo tofu": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  "fried rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
  "hakka noodles": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
  "manchurian": "https://images.unsplash.com/photo-1627308594190-a1b79df2d67d?w=400&q=80",
  "chilli chicken": "https://images.unsplash.com/photo-1627308594190-a1b79df2d67d?w=400&q=80",
  "kimchi": "https://images.unsplash.com/photo-1583224964978-225ddb3ea915?w=400&q=80",
  "bibimbap": "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&q=80",
  "bulgogi": "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80",

  // 🍕 PIZZA & PASTA
  "pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "margherita pizza": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "pepperoni pizza": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
  "bbq chicken pizza": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "veg supreme pizza": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
  "pasta": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "pasta alfredo": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&q=80",
  "pasta arrabbiata": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "spaghetti bolognese": "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=400&q=80",
  "carbonara": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&q=80",
  "pesto pasta": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
  "lasagna": "https://images.unsplash.com/photo-1619895092538-128341789043?w=400&q=80",
  "ravioli": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "mac and cheese": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
  "gnocchi": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  "risotto": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
  "garlic bread": "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&q=80",
  "bruschetta": "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=400&q=80",

  // 🍔 BURGERS, FAST FOOD & MEXICAN
  "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "cheeseburger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "chicken burger": "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=400&q=80",
  "veg burger": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  "club sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  "grilled cheese sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
  "hot dog": "https://images.unsplash.com/photo-1612392062631-94dd858cba88?w=400&q=80",
  "corn dog": "https://images.unsplash.com/photo-1612392062631-94dd858cba88?w=400&q=80",
  "fries": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
  "french fries": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
  "potato wedges": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
  "onion rings": "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80",
  "chicken nuggets": "https://images.unsplash.com/photo-1562967914-01efa7e87832?w=400&q=80",
  "fried chicken": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
  "chicken wings": "https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?w=400&q=80",
  "tacos": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80",
  "burrito": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  "quesadilla": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  "nachos": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80",

  // 🥞 BREAKFAST & BAKERY
  "pancakes": "https://images.unsplash.com/photo-1506084868230-bbd06c20fce9?w=400&q=80",
  "waffles": "https://images.unsplash.com/photo-1562376552-0d160a2f9fa4?w=400&q=80",
  "french toast": "https://images.unsplash.com/photo-1484723091791-c0e75a40d695?w=400&q=80",
  "scrambled eggs": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400&q=80",
  "omelette": "https://images.unsplash.com/photo-1510693062635-fcc730bb54ec?w=400&q=80",
  "fried eggs": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400&q=80",
  "bacon": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&q=80",
  "sausages": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&q=80",
  "hash browns": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
  "croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
  "bagel": "https://images.unsplash.com/photo-1585478259715-876a6a81fa08?w=400&q=80",
  "muffin": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80",
  "donut": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80",
  "cinnamon roll": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80",
  "toast": "https://images.unsplash.com/photo-1484723091791-c0e75a40d695?w=400&q=80",

  // 🍰 DESSERTS
  "cake": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
  "chocolate cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
  "black forest cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
  "red velvet cake": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
  "cheesecake": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80",
  "brownie": "https://images.unsplash.com/photo-1598514982205-f36b96d1e8dd?w=400&q=80",
  "macaron": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&q=80",
  "cupcake": "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80",
  "apple pie": "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&q=80",
  "fruit tart": "https://images.unsplash.com/photo-1519915028121-7d3463d20eb4?w=400&q=80",
  "chocolate chip cookies": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
  "ice cream": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80",
  "gelato": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80",
  "tiramisu": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80",
  "pudding": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  "crepe": "https://images.unsplash.com/photo-1519676860045-31a89c9237ec?w=400&q=80",

  // 🥗 HEALTHY & SALADS
  "salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "caesar salad": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80",
  "greek salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "cobb salad": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80",
  "fruit salad": "https://images.unsplash.com/photo-1490474418585-ba9bd8f241ba?w=400&q=80",
  "quinoa bowl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "smoothie bowl": "https://images.unsplash.com/photo-1490474418585-ba9bd8f241ba?w=400&q=80",
  "avocado toast": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
  "oatmeal": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80",
  "granola": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80",
  "soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",

  // ☕ DRINKS & BEVERAGES
  "chai": "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&q=80",
  "masala chai": "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&q=80",
  "green tea": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&q=80",
  "coffee": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  "espresso": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80",
  "cappuccino": "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&q=80",
  "latte": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80",
  "cold coffee": "https://images.unsplash.com/photo-1461023058943-0708e5114a09?w=400&q=80",
  "frappuccino": "https://images.unsplash.com/photo-1461023058943-0708e5114a09?w=400&q=80",
  "hot chocolate": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80",
  "juice": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
  "orange juice": "https://images.unsplash.com/photo-1600271886742-f049cd451b02?w=400&q=80",
  "apple juice": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
  "mango lassi": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "sweet lassi": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "buttermilk": "https://images.unsplash.com/photo-1625944525533-473f1d9fbd02?w=400&q=80",
  "lemonade": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  "mojito": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80",
  "margarita": "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=400&q=80",
  "pina colada": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80",
  "boba tea": "https://images.unsplash.com/photo-1558855567-1a48c4cc8e13?w=400&q=80",
  "milkshake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
  "smoothie": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80",

  // 🛡️ GENERIC FALLBACKS
  "chicken": "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80",
  "veg": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "chocolate": "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80",
  "default": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=781&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
};

  function getStaticFoodImage(name) {
    const lower = (name || "").toLowerCase();
    for (const [key, url] of Object.entries(FOOD_IMAGES_STATIC)) {
      if (lower.includes(key)) return url;
    }
    return FOOD_IMAGES_STATIC.default;
  }

// ── Smart Food Image Card with MealDB + fallback ─────────────────────────────
function FoodImageCard({ item, cs }) {
  const [imgSrc, setImgSrc] = useState(getStaticFoodImage(item.name));
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);



  return (
    <div style={{background:cs.bg,border:`0.5px solid ${cs.border}`,borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column",transition:"transform 0.2s,box-shadow 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,0,0,0.4)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
      <div style={{height:140,overflow:"hidden",position:"relative",background:T.bgCard}}>
        {!loaded && <div className="img-shimmer" style={{position:"absolute",inset:0}}/>}
        <img
          src={imgSrc}
          alt={item.name}
          onLoad={() => setLoaded(true)}
          onError={() => { setImgError(true); setImgSrc(FOOD_IMAGES_STATIC.default); setLoaded(true); }}
          style={{width:"100%",height:"100%",objectFit:"cover",display:"block",opacity:loaded?1:0,transition:"opacity 0.4s"}}
        />
        <div style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,color:cs.text,fontFamily:"'DM Mono',monospace"}}>
          ₹{item.price}
        </div>
        {!imgError && (
          <div style={{position:"absolute",bottom:6,left:8,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)",borderRadius:6,padding:"2px 6px",fontSize:9,color:"rgba(255,255,255,0.5)",fontFamily:"'DM Mono',monospace"}}>
            MealDB
          </div>
        )}
      </div>
      <div style={{padding:"12px 14px",flex:1}}>
        <div style={{fontSize:14,fontWeight:500,color:T.text,marginBottom:4}}>{item.name}</div>
        <div style={{fontSize:12,color:T.muted,lineHeight:1.55}}>{item.description}</div>
      </div>
    </div>
  );
}

// ── Reusable atoms ────────────────────────────────────────────────────────────
const Label = ({ children, style }) => (
  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:T.muted, ...style }}>{children}</span>
);

const Pill = ({ children, color=T.accentBg, textColor=T.accent }) => (
  <span style={{ background:color, color:textColor, fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, border:`0.5px solid ${textColor}30`, letterSpacing:"0.04em" }}>{children}</span>
);

const Card = ({ children, style }) => (
  <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:16, padding:"1.25rem 1.5rem", ...style }}>{children}</div>
);

const MetricCard = ({ label, value, accent }) => (
  <div style={{ background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:12, padding:"1rem 1.2rem", animation:"countUp 0.5s ease both" }}>
    <div style={{ fontSize:11, color:T.muted, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'DM Mono',monospace", marginBottom:6 }}>{label}</div>
    <div style={{ fontSize:20, fontWeight:600, color:accent?T.accent:T.text, lineHeight:1 }}>{value}</div>
  </div>
);

const Section = ({ title, children, delay=0 }) => (
  <div className={`fade-up-${delay+1}`} style={{ marginBottom:"1.75rem" }}>
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <div style={{ height:1, width:20, background:T.accent, opacity:0.6 }} />
      <Label style={{ color:T.accentMuted }}>{title}</Label>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
    {children}
  </div>
);

const inputStyle = {
  background:T.bgCard, border:`0.5px solid ${T.borderLight}`, borderRadius:10,
  padding:"11px 14px", fontSize:14, color:T.text, fontFamily:"'DM Sans',sans-serif",
  outline:"none", transition:"border-color 0.2s", width:"100%",
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"concept",     icon:"◈", label:"Concept"     },
  { id:"menu",        icon:"◉", label:"Menu"        },
  { id:"financials",  icon:"◎", label:"Financials"  },
  { id:"location",    icon:"◌", label:"Location"    },
  { id:"marketing",   icon:"◐", label:"Marketing"   },
  { id:"competitors", icon:"⚔", label:"Rivals"      },
  { id:"whatif",      icon:"⚡", label:"What If"     },
  { id:"roast",       icon:"🔥", label:"Roast Me"    },
  { id:"summary",     icon:"★", label:"AI Summary"  },
];

const CAT_COLORS = {
  "Snacks":      { bg:"#1A1008", text:"#b9d58b", border:"#b9d58b40" },
  "Main Course": { bg:"#0D1A10", text:"#4CAF7A", border:"#4CAF7A40" },
  "Beverages":   { bg:"#080D1A", text:"#6B9FE4", border:"#6B9FE440" },
  "Desserts":    { bg:"#1A0D14", text:"#E47FA0", border:"#E47FA040" },
};
const catStyle = c => CAT_COLORS[c] || { bg:"#121212", text:T.accent, border:`${T.accent}40` };

const STEPS = [
  "Analysing location & market demand…",
  "Developing brand identity & concept…",
  "Engineering menu & pricing strategy…",
  "Running financial projections…",
  "Crafting launch & marketing plan…",
];

// ── Loader ────────────────────────────────────────────────────────────────────
const Loader = ({ step }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:340, gap:32, padding:"2rem" }}>
    <div style={{ position:"relative", width:64, height:64 }}>
      <div style={{ position:"absolute", inset:0, border:`2px solid ${T.border}`, borderTopColor:T.accent, borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
      <div style={{ position:"absolute", inset:8, border:`1px solid ${T.borderLight}`, borderBottomColor:T.accentMuted, borderRadius:"50%", animation:"spin 1.4s linear infinite reverse" }} />
    </div>
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:13, color:T.accent, fontFamily:"'DM Mono',monospace", marginBottom:20, letterSpacing:"0.05em" }}>Building your restaurant business plan</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:320 }}>
        {STEPS.map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, opacity:i<=step?1:0.25, transition:"opacity 0.4s" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background:i<step?T.success:i===step?T.accent:T.border, animation:i===step?"pulse 1s ease infinite":"none", transition:"background 0.4s" }} />
            <span style={{ fontSize:12, color:i<=step?T.textSub:T.muted, textAlign:"left" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── PDF Export ────────────────────────────────────────────────────────────────
async function downloadPDF(plan, form) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W=210, M=18;
  let y=20;
  const addPage=()=>{ doc.addPage(); y=20; doc.setFillColor(22,20,18); doc.rect(0,0,W,297,"F"); };
  const checkPage=(need=20)=>{ if(y+need>275) addPage(); };
  const GOLD=[232,168,56], DARK=[22,20,18], GRAY=[120,110,100], LIGHT=[240,230,211];

  doc.setFillColor(...DARK); doc.rect(0,0,W,297,"F");
  doc.setFillColor(...GOLD); doc.rect(0,0,W,3,"F"); doc.rect(0,294,W,3,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(28); doc.setTextColor(...GOLD);
  doc.text(plan.restaurantName, W/2, 80, {align:"center"});
  doc.setFont("helvetica","italic"); doc.setFontSize(13); doc.setTextColor(...LIGHT);
  doc.text(`"${plan.tagline}"`, W/2, 94, {align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...GRAY);
  doc.text(`${form.city}, ${form.area}  ·  Budget: ₹${Number(form.budget).toLocaleString("en-IN")}  ·  ${form.vibe}`, W/2, 106, {align:"center"});
  [plan.theme, plan.brandPersonality].forEach((p,i)=>{
    const x=W/2-30+i*62;
    doc.setFillColor(42,31,10); doc.roundedRect(x-20,116,40,9,4,4,"F");
    doc.setFontSize(8); doc.setTextColor(...GOLD); doc.text(p,x,122,{align:"center"});
  });
  doc.setFontSize(8); doc.setTextColor(...GRAY);
  doc.text("Generated by OriginBite Studio · AI-Powered Business Plan", W/2, 270, {align:"center"});

  const secHeader=(title)=>{
    checkPage(18);
    doc.setFillColor(...GOLD); doc.rect(M,y,4,10,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(13); doc.setTextColor(...GOLD);
    doc.text(title, M+8, y+7);
    doc.setDrawColor(...GOLD); doc.setLineWidth(0.3); doc.line(M+8,y+9,W-M,y+9);
    y+=16;
  };
  const bodyText=(text,indent=0)=>{
    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...LIGHT);
    const lines=doc.splitTextToSize(text, W-M*2-indent);
    lines.forEach(l=>{ checkPage(6); doc.text(l,M+indent,y); y+=5.5; }); y+=2;
  };
  const labelVal=(lbl,val)=>{
    checkPage(8);
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...GOLD); doc.text(lbl+":", M, y);
    doc.setFont("helvetica","normal"); doc.setTextColor(...LIGHT);
    const lines=doc.splitTextToSize(val, W-M*2-42);
    lines.forEach((l,i)=>{ doc.text(l,M+42,y); if(i<lines.length-1) y+=5.5; }); y+=6;
  };
  const metBox=(lbl,val,x,bw)=>{
    doc.setFillColor(30,27,24); doc.roundedRect(x,y,bw,18,3,3,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(...GRAY); doc.text(lbl,x+bw/2,y+6,{align:"center"});
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...GOLD); doc.text(String(val),x+bw/2,y+14,{align:"center"});
  };

  addPage();
  secHeader("1. Business Concept");
  labelVal("Target Audience", plan.targetAudience); y+=2;
  labelVal("Why This Works", plan.conceptWhy); y+=4;
  secHeader("2. Brand Identity");
  labelVal("Name", plan.restaurantName);
  labelVal("Tagline", plan.tagline);
  labelVal("Theme", plan.theme);
  labelVal("Brand Personality", plan.brandPersonality);
  if(plan.colorNames) labelVal("Color Palette", plan.colorNames.join("  ·  "));

  addPage();
  secHeader("3. Menu");
  const grouped=(plan.menu||[]).reduce((a,i)=>{ (a[i.category]=a[i.category]||[]).push(i); return a; },{});
  Object.entries(grouped).forEach(([cat,items])=>{
    checkPage(14);
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...GOLD); doc.text(cat,M,y); y+=6;
    items.forEach(item=>{
      checkPage(12);
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...LIGHT); doc.text(item.name,M+4,y);
      doc.setFont("helvetica","normal"); doc.setTextColor(...GOLD); doc.text(`₹${item.price}`,W-M,y,{align:"right"}); y+=5;
      doc.setFont("helvetica","italic"); doc.setFontSize(8); doc.setTextColor(...GRAY);
      const desc=doc.splitTextToSize(item.description,W-M*2-20);
      desc.forEach(d=>{ doc.text(d,M+4,y); y+=4.5; }); y+=1;
    }); y+=4;
  });
  y+=2; secHeader("Pricing Strategy"); bodyText(plan.pricingLogic);

  addPage();
  secHeader("4. Financial Projections");
  const bw=(W-M*2-18)/4;
  metBox("Avg Order",`₹${plan.avgOrderValue}`,M,bw);
  metBox("Daily Orders",plan.dailyOrders,M+bw+6,bw);
  metBox("Monthly Revenue",`₹${Number(plan.monthlyRevenue).toLocaleString("en-IN")}`,M+(bw+6)*2,bw);
  metBox("Break-Even",`${plan.breakEvenMonths}mo`,M+(bw+6)*3,bw); y+=24;
  const bw2=(W-M*2-6)/2;
  metBox("Setup Cost",`₹${Number(plan.setupCost).toLocaleString("en-IN")}`,M,bw2);
  metBox("Monthly Opex",`₹${Number(plan.monthlyOpex).toLocaleString("en-IN")}`,M+bw2+6,bw2); y+=28;
  checkPage(50);
  const bars=[
    {label:"Revenue",val:plan.monthlyRevenue,color:GOLD},
    {label:"Opex",val:plan.monthlyOpex,color:[192,57,43]},
    {label:"Profit",val:Math.max(0,plan.monthlyRevenue-plan.monthlyOpex),color:[61,138,92]},
  ];
  const maxV=Math.max(...bars.map(b=>b.val),1), chartW=W-M*2-40;
  bars.forEach(b=>{
    const fill=Math.round((b.val/maxV)*chartW);
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...GRAY); doc.text(b.label,M,y+5);
    doc.setFillColor(42,36,30); doc.roundedRect(M+36,y,chartW,8,2,2,"F");
    doc.setFillColor(...b.color); doc.roundedRect(M+36,y,Math.max(fill,4),8,2,2,"F");
    doc.setFontSize(7); doc.setTextColor(...b.color); doc.text(`₹${Number(b.val).toLocaleString("en-IN")}`,W-M,y+6,{align:"right"});
    y+=14;
  });

  addPage();
  secHeader("5. Location Strategy");
  labelVal("Micro-Location", plan.microLocation); bodyText(plan.microLocationReason); y+=4;
  secHeader("6. Marketing Plan");
  bodyText(plan.launchStrategy); y+=2;
  labelVal("Opening Offer", plan.openingOffer); y+=4;
  doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...GOLD); doc.text("Instagram Post Ideas",M,y); y+=7;
  (plan.instaPosts||[]).forEach((p,i)=>{
    checkPage(22);
    doc.setFillColor(26,16,8); doc.roundedRect(M,y,W-M*2,20,3,3,"F");
    doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...GOLD); doc.text(`Post ${i+1}: ${p.concept}`,M+4,y+7);
    doc.setFont("helvetica","italic"); doc.setFontSize(8); doc.setTextColor(...LIGHT);
    const cl=doc.splitTextToSize(p.caption,W-M*2-10); cl.slice(0,1).forEach(l=>doc.text(l,M+4,y+14));
    y+=24;
  });

  addPage();
  secHeader("7. AI Consultant Summary");
  doc.setFillColor(42,31,10);
  const sl=doc.splitTextToSize(plan.aiSummary,W-M*2-16);
  doc.roundedRect(M,y,W-M*2,sl.length*6+16,4,4,"F");
  doc.setFont("helvetica","italic"); doc.setFontSize(10); doc.setTextColor(...LIGHT);
  sl.forEach((l,i)=>{ doc.text(l,M+8,y+10+i*6); }); y+=sl.length*6+26;
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...GRAY);
  doc.text(`${plan.restaurantName}  ·  Business Plan  ·  OriginBite Studio`, W/2, 285, {align:"center"});

  doc.save(`${plan.restaurantName.replace(/\s+/g,"-")}-BusinessPlan.pdf`);
}

// ── Groq helper ───────────────────────────────────────────────────────────────
const groq = requestAI;

// ── What If Tab ───────────────────────────────────────────────────────────────
function WhatIfTab({ plan, form }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [scenario, setScenario] = useState("custom");
  const [customQ, setCustomQ]   = useState("");
  const [focus, setFocus]       = useState(false);

  const PRESETS = [
    { id:"rent",     label:"🏠 Rent doubles",             q:`What happens to ${plan.restaurantName}'s finances if monthly rent doubles?` },
    { id:"comp",     label:"⚔️ New competitor opens",     q:`A similar restaurant opens 200m away from ${plan.restaurantName}. Impact and response?` },
    { id:"viral",    label:"🚀 Goes viral on Instagram",  q:`${plan.restaurantName} goes viral overnight. How do we handle the surge and scale?` },
    { id:"supplier", label:"📦 Supplier price hike 30%", q:`Key ingredient costs rise 30% for ${plan.restaurantName}. What adjustments needed?` },
    { id:"staff",    label:"👨‍🍳 Head chef quits",         q:`The head chef of ${plan.restaurantName} quits suddenly. Disaster plan?` },
    { id:"slow",     label:"📉 Orders drop 40%",          q:`${plan.restaurantName}'s daily orders drop 40% for 2 months. Survival strategy?` },
    { id:"custom",   label:"✏️ Ask your own question",    q:"" },
  ];

  const run = async () => {
    const selected = PRESETS.find(p=>p.id===scenario);
    const question = scenario==="custom" ? customQ : selected.q;
    if (!question.trim()) return;
    setLoading(true); setResult(null);
    const ctx=`Restaurant: ${plan.restaurantName}, ${form.city} ${form.area}. Budget: ₹${Number(form.budget).toLocaleString("en-IN")}. Vibe: ${form.vibe}. Avg order: ₹${plan.avgOrderValue}. Daily orders: ${plan.dailyOrders}. Monthly revenue: ₹${Number(plan.monthlyRevenue).toLocaleString("en-IN")}. Monthly opex: ₹${Number(plan.monthlyOpex).toLocaleString("en-IN")}. Break-even: ${plan.breakEvenMonths} months.`;
    const prompt=`You are a restaurant business consultant. Context: ${ctx}\n\nScenario: ${question}\n\nRespond in JSON only (no markdown, no backticks):\n{"headline":"one-line punchy summary","severity":"low|medium|high|critical","impact":"2-3 sentences on financial/operational impact","immediate":["action1","action2","action3"],"shortTerm":["action1","action2","action3"],"opportunity":"silver lining or opportunity 1-2 sentences","survivalChance":0}`;
    try {
      const raw = await groq(prompt, 800, () => localScenario(plan, scenario, question));
      setResult(JSON.parse(raw));
    } catch(e) { setResult({headline:"Error running scenario",severity:"low",impact:e.message,immediate:[],shortTerm:[],opportunity:"",survivalChance:50}); }
    setLoading(false);
  };

  const sevColor={low:T.success,medium:T.accent,high:"#E67E22",critical:T.error};
  const sevBg   ={low:T.successBg,medium:T.accentBg,high:"#1F0E00",critical:T.errorBg};

  return (
    <div>
      <Section title="Choose a scenario" delay={0}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,marginBottom:14}}>
          {PRESETS.map(p=>(
            <button key={p.id} onClick={()=>setScenario(p.id)} style={{
              background:scenario===p.id?T.accentBg:T.bgCard,
              border:`0.5px solid ${scenario===p.id?T.accent:T.border}`,
              borderRadius:10,padding:"10px 14px",fontSize:13,
              color:scenario===p.id?T.accent:T.textSub,
              cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",
            }}>{p.label}</button>
          ))}
        </div>
        {scenario==="custom" && (
          <textarea value={customQ} onChange={e=>setCustomQ(e.target.value)}
            placeholder={`e.g. What if ${plan.restaurantName} opens a second outlet?`}
            onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
            style={{...inputStyle,minHeight:90,resize:"vertical",borderColor:focus?T.accent:T.borderLight,marginBottom:14,display:"block"}} />
        )}
        <button onClick={run} disabled={loading} style={{
          padding:"12px 24px",background:loading?T.border:T.accent,color:loading?T.muted:"#0c1913",
          border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",
        }}>{loading?"Analysing scenario…":"Run scenario ⚡"}</button>
      </Section>

      {loading && (
        <div style={{textAlign:"center",padding:"2rem",color:T.textSub,fontSize:13}}>
          <div style={{width:28,height:28,border:`2px solid ${T.border}`,borderTopColor:T.accent,borderRadius:"50%",animation:"spin 0.9s linear infinite",margin:"0 auto 12px"}}/>
          Running scenario analysis…
        </div>
      )}

      {result && !loading && (
        <div className="fade-up">
          <Section title="Scenario analysis" delay={0}>
            <div style={{background:sevBg[result.severity]||T.accentBg,border:`0.5px solid ${(sevColor[result.severity]||T.accent)}50`,borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10}}>
                <p style={{fontSize:16,fontWeight:600,color:T.text,lineHeight:1.4}}>{result.headline}</p>
                <Pill color={sevBg[result.severity]} textColor={sevColor[result.severity]||T.accent}>{(result.severity||"").toUpperCase()}</Pill>
              </div>
              <p style={{fontSize:13,color:T.textSub,lineHeight:1.7}}>{result.impact}</p>
            </div>
            <Card style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <Label>Scenario resilience index</Label>
                <span style={{fontSize:14,fontWeight:600,color:result.survivalChance>60?T.success:result.survivalChance>30?T.accent:T.error,fontFamily:"'DM Mono',monospace"}}>{result.survivalChance}%</span>
              </div>
              <div style={{height:8,background:T.border,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${result.survivalChance}%`,background:result.survivalChance>60?T.success:result.survivalChance>30?T.accent:T.error,borderRadius:4,transition:"width 1s ease"}}/>
              </div>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <Card>
                <Label style={{display:"block",marginBottom:10}}>Immediate actions (0–7 days)</Label>
                {(result.immediate||[]).map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:T.accentBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.accent,flexShrink:0}}>{i+1}</div>
                    <span style={{fontSize:12,color:T.textSub,lineHeight:1.5}}>{a}</span>
                  </div>
                ))}
              </Card>
              <Card>
                <Label style={{display:"block",marginBottom:10}}>Short-term strategy (1–3 months)</Label>
                {(result.shortTerm||[]).map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"#0D1A10",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.success,flexShrink:0}}>{i+1}</div>
                    <span style={{fontSize:12,color:T.textSub,lineHeight:1.5}}>{a}</span>
                  </div>
                ))}
              </Card>
            </div>
            {result.opportunity && (
              <div style={{background:T.successBg,border:`0.5px solid ${T.success}40`,borderRadius:12,padding:"1rem 1.25rem"}}>
                <Label style={{color:T.success,display:"block",marginBottom:6}}>Silver lining / opportunity</Label>
                <p style={{fontSize:13,color:"#7ECFA0",lineHeight:1.7}}>{result.opportunity}</p>
              </div>
            )}
          </Section>
        </div>
      )}
    </div>
  );
}

// ── Competitors Tab ───────────────────────────────────────────────────────────
function CompetitorsTab({ plan, form }) {
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState(null);

  const fetch_ = async () => {
    setLoading(true); setData(null);
    const prompt = `You are a competitive intelligence analyst. Restaurant: "${plan.restaurantName}" in ${form.city}, ${form.area}. Vibe: ${form.vibe}. Cuisine: ${plan.theme}.

Generate 3 realistic competitor profiles for this area. Return JSON only (no markdown):
{"competitors":[{"name":"","type":"","estimatedRevenue":"","strengths":["",""],"weaknesses":["",""],"ourAdvantage":"","threatLevel":"low|medium|high|critical","priceRange":"₹X-₹Y per person"}],"marketGap":"2-3 sentences on the gap we fill","winStrategy":"2-3 sentences on how we beat them all"}`;
    try {
      const raw = await groq(prompt, 1200, () => localCompetitors(form));
      setData(JSON.parse(raw));
    } catch(e) { setData({ error: e.message }); }
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const threatColor = { low:T.success, medium:T.accent, high:"#E67E22", critical:T.error };
  const threatBg    = { low:T.successBg, medium:T.accentBg, high:"#1F0E00", critical:T.errorBg };

  return (
    <div>
      {loading && (
        <div style={{textAlign:"center",padding:"3rem",color:T.textSub,fontSize:13}}>
          <div style={{width:32,height:32,border:`2px solid ${T.border}`,borderTopColor:T.accent,borderRadius:"50%",animation:"spin 0.9s linear infinite",margin:"0 auto 16px"}}/>
          Scouting the competition in {form.area}…
        </div>
      )}
      {data?.error && <Card><p style={{color:T.error,fontSize:13}}>{data.error}</p></Card>}
      {data && !data.error && (
        <div className="fade-up">
          <Section title="Market gap you fill" delay={0}>
            <div style={{background:"#080D1A",border:`0.5px solid #6B9FE440`,borderRadius:14,padding:"1.25rem 1.5rem"}}>
              <p style={{fontSize:14,color:"#6B9FE4",lineHeight:1.8}}>{data.marketGap}</p>
            </div>
          </Section>
          <Section title="Competitor radar" delay={1}>
            <div style={{display:"grid",gap:14}}>
              {(data.competitors||[]).map((c,i)=>(
                <div key={i} style={{background:threatBg[c.threatLevel]||T.accentBg,border:`0.5px solid ${(threatColor[c.threatLevel]||T.accent)}40`,borderRadius:14,padding:"1.25rem 1.5rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:600,color:T.text,marginBottom:3}}>{c.name}</div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <Pill color={T.bgCard} textColor={T.muted}>{c.type}</Pill>
                        <Pill color={T.bgCard} textColor={T.muted}>{c.priceRange}</Pill>
                        <Pill color={T.bgCard} textColor={T.muted}>~{c.estimatedRevenue}/mo</Pill>
                      </div>
                    </div>
                    <Pill color={threatBg[c.threatLevel]} textColor={threatColor[c.threatLevel]||T.accent}>{(c.threatLevel||"").toUpperCase()} THREAT</Pill>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    <div>
                      <Label style={{display:"block",marginBottom:7,color:"#4CAF7A"}}>Their strengths</Label>
                      {(c.strengths||[]).map((s,j)=>(
                        <div key={j} style={{display:"flex",gap:6,marginBottom:5,alignItems:"flex-start"}}>
                          <span style={{color:"#4CAF7A",fontSize:10,marginTop:3}}>▲</span>
                          <span style={{fontSize:12,color:T.textSub}}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label style={{display:"block",marginBottom:7,color:T.error}}>Their weaknesses</Label>
                      {(c.weaknesses||[]).map((w,j)=>(
                        <div key={j} style={{display:"flex",gap:6,marginBottom:5,alignItems:"flex-start"}}>
                          <span style={{color:T.error,fontSize:10,marginTop:3}}>▼</span>
                          <span style={{fontSize:12,color:T.textSub}}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"10px 14px"}}>
                    <Label style={{display:"block",marginBottom:4,color:T.accent}}>Our advantage vs them</Label>
                    <p style={{fontSize:13,color:T.accent,lineHeight:1.6}}>{c.ourAdvantage}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Winning strategy" delay={2}>
            <div style={{background:T.successBg,border:`0.5px solid ${T.success}40`,borderRadius:14,padding:"1.25rem 1.5rem"}}>
              <p style={{fontSize:14,color:"#7ECFA0",lineHeight:1.8}}>{data.winStrategy}</p>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

// ── Roast Me Tab ──────────────────────────────────────────────────────────────
function RoastTab({ plan, form }) {
  const [loading, setLoading] = useState(false);
  const [roast, setRoast]     = useState(null);
  const [revealed, setRevealed] = useState(false);

  const runRoast = async () => {
    setLoading(true); setRoast(null); setRevealed(false);
    const prompt = `You are a brutally honest, sarcastic, but ultimately helpful restaurant consultant who has seen hundreds of businesses fail. Your job is to ROAST this restaurant plan mercilessly, but every criticism must be backed by a real fix.

Restaurant: "${plan.restaurantName}" — "${plan.tagline}"
Location: ${form.city}, ${form.area} | Vibe: ${form.vibe}
Budget: ₹${Number(form.budget).toLocaleString("en-IN")}
Break-even: ${plan.breakEvenMonths} months
Monthly revenue projection: ₹${Number(plan.monthlyRevenue).toLocaleString("en-IN")}

Return JSON only (no markdown, no backticks):
{
  "overallVerdict": "one brutal, punchy sentence verdict",
  "score": 0,
  "scoreLabel": "e.g. Mediocre at best",
  "roasts": [
    {"issue": "short issue title", "roast": "brutal 1-2 sentence takedown", "fix": "concrete fix in 1-2 sentences"}
  ],
  "biggestRisk": "the single biggest thing that will kill this restaurant",
  "hiddenGem": "one thing about this plan that is actually really smart",
  "finalAdvice": "tough love closing paragraph"
}

Be savage but fair. Give 4-5 roasts. Score out of 100.`;
    try {
      const raw = await groq(prompt, 1200, () => localRoast(plan));
      setRoast(JSON.parse(raw));
    } catch(e) { setRoast({ error: e.message }); }
    setLoading(false);
  };

  const scoreColor = s => s >= 70 ? T.success : s >= 50 ? T.accent : s >= 30 ? "#E67E22" : T.error;

  return (
    <div>
      {!roast && !loading && (
        <div style={{textAlign:"center",padding:"3rem 1.5rem"}}>
          <div style={{fontSize:48,marginBottom:16}}>🔥</div>
          <h3 style={{fontFamily:"'Lora',serif",fontSize:22,color:T.cream,marginBottom:10}}>Think your plan is solid?</h3>
          <p style={{fontSize:14,color:T.textSub,lineHeight:1.7,maxWidth:400,margin:"0 auto 24px"}}>Let our brutally honest AI consultant tear it apart. Every roast comes with a fix. This is the feedback that saves restaurants.</p>
          <button onClick={runRoast} style={{
            padding:"14px 32px",background:T.error,color:"#fff",border:"none",
            borderRadius:12,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
            transition:"transform 0.15s",
          }}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
          onMouseUp={e=>e.currentTarget.style.transform=""}>
            Roast my plan 🔥
          </button>
        </div>
      )}

      {loading && (
        <div style={{textAlign:"center",padding:"3rem",color:T.textSub,fontSize:13}}>
          <div style={{fontSize:36,marginBottom:16,animation:"pulse 1s ease infinite"}}>🔥</div>
          Sharpening knives… preparing brutal feedback…
        </div>
      )}

      {roast && !roast.error && !loading && (
        <div className="fade-up">
          {/* Score card */}
          <div style={{background:T.errorBg,border:`0.5px solid ${T.error}50`,borderRadius:16,padding:"1.75rem 2rem",marginBottom:"1.5rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-10,right:-10,fontSize:80,opacity:0.06}}>🔥</div>
            <div style={{fontSize:13,color:T.muted,fontFamily:"'DM Mono',monospace",marginBottom:8,letterSpacing:"0.1em"}}>PLAN SCORE</div>
            <div style={{fontSize:56,fontWeight:700,color:scoreColor(roast.score),lineHeight:1,marginBottom:6,fontFamily:"'Lora',serif"}}>{roast.score}</div>
            <div style={{fontSize:14,color:T.textSub,marginBottom:16}}>{roast.scoreLabel}</div>
            <div style={{height:6,background:T.border,borderRadius:3,overflow:"hidden",maxWidth:300,margin:"0 auto 16px"}}>
              <div style={{height:"100%",width:`${roast.score}%`,background:scoreColor(roast.score),borderRadius:3,transition:"width 1.5s ease"}}/>
            </div>
            <p style={{fontSize:15,color:T.text,fontStyle:"italic",lineHeight:1.6}}>"{roast.overallVerdict}"</p>
          </div>

          {/* Roasts */}
          <Section title="The takedown" delay={0}>
            {!revealed ? (
              <div style={{textAlign:"center",padding:"1.5rem"}}>
                <button onClick={()=>setRevealed(true)} style={{
                  padding:"12px 28px",background:"transparent",border:`0.5px solid ${T.error}`,
                  borderRadius:10,color:T.error,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                }}>Reveal all roasts 🔥</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {(roast.roasts||[]).map((r,i)=>(
                  <div key={i} className="fade-up" style={{background:T.bgCard,border:`0.5px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
                    <div style={{padding:"14px 18px",borderBottom:`0.5px solid ${T.border}`}}>
                      <div style={{fontSize:12,fontWeight:600,color:T.error,marginBottom:6,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:"0.08em"}}>#{i+1} {r.issue}</div>
                      <p style={{fontSize:14,color:T.text,lineHeight:1.7,fontStyle:"italic"}}>"{r.roast}"</p>
                    </div>
                    <div style={{padding:"12px 18px",background:T.successBg}}>
                      <Label style={{color:T.success,display:"block",marginBottom:5}}>The fix</Label>
                      <p style={{fontSize:13,color:"#7ECFA0",lineHeight:1.6}}>{r.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.5rem"}}>
            <div style={{background:T.errorBg,border:`0.5px solid ${T.error}40`,borderRadius:14,padding:"1.25rem 1.5rem"}}>
              <Label style={{color:T.error,display:"block",marginBottom:8}}>☠ Biggest risk</Label>
              <p style={{fontSize:13,color:"#E88",lineHeight:1.7}}>{roast.biggestRisk}</p>
            </div>
            <div style={{background:T.successBg,border:`0.5px solid ${T.success}40`,borderRadius:14,padding:"1.25rem 1.5rem"}}>
              <Label style={{color:T.success,display:"block",marginBottom:8}}>💎 Hidden gem</Label>
              <p style={{fontSize:13,color:"#7ECFA0",lineHeight:1.7}}>{roast.hiddenGem}</p>
            </div>
          </div>

          <div style={{background:`linear-gradient(135deg,${T.accentBg} 0%,${T.bgCard} 100%)`,border:`0.5px solid ${T.accentMuted}60`,borderRadius:14,padding:"1.5rem"}}>
            <Label style={{color:T.accentMuted,display:"block",marginBottom:10}}>Tough love closing</Label>
            <p style={{fontSize:14,color:T.text,lineHeight:1.9,fontFamily:"'Lora',serif",fontWeight:500}}>{roast.finalAdvice}</p>
          </div>

          <div style={{textAlign:"center",marginTop:20}}>
            <button onClick={runRoast} style={{
              padding:"10px 24px",background:"transparent",border:`0.5px solid ${T.borderLight}`,
              borderRadius:10,color:T.textSub,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
            }}>Roast again 🔥</button>
          </div>
        </div>
      )}
      {roast?.error && <Card><p style={{color:T.error,fontSize:13}}>{roast.error}</p></Card>}
    </div>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────
const ConceptTab = ({ d }) => (
  <div>
    <Section title="Target audience" delay={0}>
      <Card><p style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>{d.targetAudience}</p></Card>
    </Section>
    <Section title="Why this concept works here" delay={1}>
      <Card><p style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>{d.conceptWhy}</p></Card>
    </Section>
  </div>
);

const MenuTab = ({ d }) => {
  const grouped=(d.menu||[]).reduce((a,i)=>{ (a[i.category]=a[i.category]||[]).push(i); return a; },{});
  return (
    <div>
      <div style={{background:T.accentBg,border:`0.5px solid ${T.accent}30`,borderRadius:10,padding:"8px 14px",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:8}}>
       
      </div>
      {Object.entries(grouped).map(([cat,items],ci)=>{
        const cs=catStyle(cat);
        return (
          <Section key={cat} title={cat} delay={ci}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
              {items.map((item,i)=>(
                <FoodImageCard key={i} item={item} cs={cs} />
              ))}
            </div>
          </Section>
        );
      })}
      <Section title="Pricing logic" delay={Object.keys(grouped).length}>
        <Card><p style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>{d.pricingLogic}</p></Card>
      </Section>
    </div>
  );
};

const FinancialsTab = ({ d, budget }) => {
  const margin=d.monthlyRevenue>0?Math.round(((d.monthlyRevenue-d.monthlyOpex)/d.monthlyRevenue)*100):0;
  const profit=Math.max(0,d.monthlyRevenue-d.monthlyOpex);

  // 12-month projection
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const growthRate=0.06;
  const projections=months.map((_,i)=>({
    month:months[i],
    revenue:Math.round(d.monthlyRevenue*(1+growthRate*i)),
    opex:Math.round(d.monthlyOpex*(1+0.015*i)),
  }));
  const maxRev=Math.max(...projections.map(p=>p.revenue));

  const bars=[
    {label:"Revenue",value:d.monthlyRevenue,color:T.accent},
    {label:"Opex",value:d.monthlyOpex,color:T.error},
    {label:"Profit",value:profit,color:T.success},
  ];
  const maxV=Math.max(...bars.map(b=>b.value),1);

  return (
    <div>
      <Section title="Key metrics" delay={0}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10,marginBottom:14}}>
          <MetricCard label="Budget"          value={`₹${Number(budget).toLocaleString("en-IN")}`}/>
          <MetricCard label="Setup cost"      value={`₹${Number(d.setupCost).toLocaleString("en-IN")}`}/>
          <MetricCard label="Avg order"       value={`₹${d.avgOrderValue}`} accent/>
          <MetricCard label="Daily orders"    value={d.dailyOrders}/>
          <MetricCard label="Monthly revenue" value={`₹${Number(d.monthlyRevenue).toLocaleString("en-IN")}`} accent/>
          <MetricCard label="Monthly opex"    value={`₹${Number(d.monthlyOpex).toLocaleString("en-IN")}`}/>
          <MetricCard label="Margin"          value={`${margin}%`} accent/>
          <MetricCard label="Break-even"      value={`${d.breakEvenMonths} mo`}/>
        </div>
      </Section>

      <Section title="Monthly snapshot" delay={1}>
        <Card>
          {bars.map((b,i)=>{
            const pct=Math.round((b.value/maxV)*100);
            return (
              <div key={i} style={{marginBottom:i<bars.length-1?14:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:T.textSub}}>{b.label}</span>
                  <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:b.color}}>₹{Number(b.value).toLocaleString("en-IN")}</span>
                </div>
                <div style={{height:6,background:T.border,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:b.color,borderRadius:3,transition:"width 1s ease"}}/>
                </div>
              </div>
            );
          })}
        </Card>
      </Section>

      <Section title="12-month revenue projection" delay={2}>
        <Card>
          <div style={{display:"flex",gap:3,alignItems:"flex-end",height:120,marginBottom:8}}>
            {projections.map((p,i)=>{
              const h=Math.round((p.revenue/maxRev)*100);
              const isProfit=p.revenue>p.opex;
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{width:"100%",height:`${h}%`,background:isProfit?`${T.accent}CC`:`${T.error}CC`,borderRadius:"3px 3px 0 0",transition:"height 1s ease",minHeight:4,position:"relative"}}
                    title={`Revenue: ₹${Number(p.revenue).toLocaleString("en-IN")}`}/>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:3}}>
            {projections.map((p,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",fontSize:9,color:T.muted,fontFamily:"'DM Mono',monospace"}}>{p.month.slice(0,1)}</div>
            ))}
          </div>
          <div style={{display:"flex",gap:16,marginTop:12,justifyContent:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.muted}}>
              <div style={{width:10,height:10,borderRadius:2,background:T.accent}}/> Profitable month
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:T.muted}}>
              <div style={{width:10,height:10,borderRadius:2,background:T.error}}/> Loss month
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
};

const LocationTab = ({ d }) => (
  <div>
    <Section title="Recommended micro-location" delay={0}>
      <Card style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:T.accentBg,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>◎</div>
          <p style={{fontSize:15,fontWeight:500,color:T.text}}>{d.microLocation}</p>
        </div>
      </Card>
      <Card><p style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>{d.microLocationReason}</p></Card>
    </Section>
  </div>
);

// ── Instagram Preview Card ────────────────────────────────────────────────────
function InstaPreview({ post, plan, menuImg }) {
  const [imgSrc, setImgSrc] = useState(menuImg || FOOD_IMAGES_STATIC.default);
  return (
    <div style={{background:"#1A1A2E",border:`0.5px solid #3D3D5C`,borderRadius:14,overflow:"hidden",maxWidth:340,margin:"0 auto"}}>
      {/* Header */}
      <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🍽</div>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{plan.restaurantName.toLowerCase().replace(/\s+/g,"_")}</div>
          <div style={{fontSize:10,color:"#888"}}>{plan.microLocation || "Sponsored"}</div>
        </div>
        <div style={{marginLeft:"auto",fontSize:16,color:"#888"}}>···</div>
      </div>
      {/* Image */}
      <div style={{height:220,overflow:"hidden",background:"#111"}}>
        <img src={imgSrc} alt="post" onError={()=>setImgSrc(FOOD_IMAGES_STATIC.default)} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      </div>
      {/* Actions */}
      <div style={{padding:"10px 14px 4px"}}>
        <div style={{display:"flex",gap:16,marginBottom:8,fontSize:20}}>
          <span style={{cursor:"pointer"}}>🤍</span>
          <span style={{cursor:"pointer"}}>💬</span>
          <span style={{cursor:"pointer"}}>↗</span>
          <span style={{marginLeft:"auto",cursor:"pointer"}}>🔖</span>
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:6}}>1,247 likes</div>
        <div style={{fontSize:12,color:"#ccc",lineHeight:1.6}}>
          <span style={{fontWeight:600}}>{plan.restaurantName.toLowerCase().replace(/\s+/g,"_")} </span>
          {post.caption}
        </div>
        <div style={{fontSize:11,color:"#6B9FE4",marginTop:6,lineHeight:1.6}}>
          #food #{plan.theme?.toLowerCase().replace(/\s+/g,"")} #{plan.city} #restaurant #foodie
        </div>
        <div style={{fontSize:10,color:"#555",marginTop:6}}>2 hours ago</div>
      </div>
    </div>
  );
}

const MarketingTab = ({ d, plan }) => {
  const [showInsta, setShowInsta] = useState(false);
  const menuImg = d.menu?.[0] ? getStaticFoodImage(d.menu[0].name) : FOOD_IMAGES_STATIC.default;

  return (
    <div>
      <Section title="Launch strategy" delay={0}>
        <Card style={{marginBottom:12}}><p style={{fontSize:14,color:T.textSub,lineHeight:1.8}}>{d.launchStrategy}</p></Card>
      </Section>
      <Section title="Opening offer" delay={1}>
        <div style={{background:T.successBg,border:`0.5px solid ${T.success}50`,borderRadius:12,padding:"1rem 1.25rem",display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{fontSize:18,flexShrink:0}}>🎁</span>
          <p style={{fontSize:14,color:"#7ECFA0",lineHeight:1.7}}>{d.openingOffer}</p>
        </div>
      </Section>
      <Section title="Instagram post ideas" delay={2}>
        <div style={{marginBottom:12}}>
          <button onClick={()=>setShowInsta(!showInsta)} style={{
            padding:"8px 18px",background:showInsta?T.accentBg:"transparent",
            border:`0.5px solid ${T.accent}`,borderRadius:8,
            color:T.accent,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:14,
          }}>{showInsta ? "📋 Show captions" : "📱 Preview as Instagram"}</button>
        </div>
        {showInsta ? (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {(d.instaPosts||[]).map((p,i)=>(
              <InstaPreview key={i} post={p} plan={{...d, city: plan?.city}} menuImg={menuImg}/>
            ))}
          </div>
        ) : (
          (d.instaPosts||[]).map((p,i)=>(
            <div key={i} style={{background:T.bgCard,border:`0.5px solid ${T.border}`,borderRadius:12,padding:"1rem 1.25rem",marginBottom:10,borderLeft:`3px solid ${T.accent}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                <Pill>{`Post ${i+1}`}</Pill>
                <span style={{fontSize:13,fontWeight:500,color:T.text}}>{p.concept}</span>
              </div>
              <p style={{fontSize:13,color:T.textSub,lineHeight:1.7,fontStyle:"italic"}}>{p.caption}</p>
            </div>
          ))
        )}
      </Section>
    </div>
  );
};

const SummaryTab = ({ d }) => (
  <div className="fade-up">
    <div style={{background:`linear-gradient(135deg,${T.accentBg} 0%,${T.bgCard} 100%)`,border:`0.5px solid ${T.accentMuted}60`,borderRadius:16,padding:"2rem",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:100,opacity:0.04,lineHeight:1}}>★</div>
      <Label style={{color:T.accentMuted,marginBottom:14,display:"block"}}>Planning summary</Label>
      <p style={{fontSize:15,color:T.text,lineHeight:1.9,fontFamily:"'Lora',serif",fontWeight:500}}>{d.aiSummary}</p>
    </div>
  </div>
);

// ── Share Plan ────────────────────────────────────────────────────────────────
function getShareURL(plan, form) {
  try {
    const payload = btoa(encodeURIComponent(JSON.stringify({ plan, form })));
    return `${window.location.origin}${window.location.pathname}?plan=${payload}`;
  } catch(_) { return null; }
}

function loadSharedPlan() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("plan");
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(atob(raw)));
  } catch(_) { return null; }
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function RestaurantPlanGenerator() {
  const [phase, setPhase]       = useState("input");
  const [loaderStep, setStep]   = useState(0);
  const [activeTab, setTab]     = useState("concept");
  const [plan, setPlan]         = useState(null);
  const [errorMsg, setError]    = useState("");
  const [pdfLoading, setPdfLoad]= useState(false);
  const [focusField, setFocus]  = useState(null);
  const [copied, setCopied]     = useState(false);
  const stepIv = useRef(null);

  const [form, setForm] = useState({
    budget:"800000", city:"Mumbai", area:"Andheri East",
    vibe:"Fast casual (affordable but modern)", cuisine:"",
  });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));



  // Check for shared plan in URL
  useEffect(()=>{
    const shared = loadSharedPlan() || readLocal("business-plan", null);
    if (shared?.plan && shared?.form) {
      setPlan(shared.plan);
      setForm(shared.form);
      setPhase("plan");
    }
  },[]);

  useEffect(()=>{
    if (phase==="loading") {
      setStep(0); let s=0;
      stepIv.current=setInterval(()=>{ s++; if(s<STEPS.length) setStep(s); else clearInterval(stepIv.current); },900);
    }
    return ()=>clearInterval(stepIv.current);
  },[phase]);

  const generate = async () => {
    if (!form.budget||!form.city||!form.area) return;
    if (Number(form.budget) < 50000) { setError("Budget must be at least INR 50,000."); setPhase("error"); return; }
    setPhase("loading"); setTab("concept");

    const prompt=`You are a restaurant founding team of 7 experts. Generate a complete, realistic, execution-ready restaurant business plan:

Budget: ₹${Number(form.budget).toLocaleString("en-IN")}
Location: ${form.city}, ${form.area}
Vibe: ${form.vibe}
Cuisine: ${form.cuisine||"decide best fit for location and audience"}

Return ONLY valid JSON (no markdown, no backticks, no extra text):
{"restaurantName":"","tagline":"","theme":"","brandPersonality":"","colorPalette":["#hex1","#hex2","#hex3"],"colorNames":["name1","name2","name3"],"targetAudience":"","conceptWhy":"","microLocation":"","microLocationReason":"","menu":[{"category":"Snacks","name":"","description":"","price":0},{"category":"Snacks","name":"","description":"","price":0},{"category":"Snacks","name":"","description":"","price":0},{"category":"Main Course","name":"","description":"","price":0},{"category":"Main Course","name":"","description":"","price":0},{"category":"Main Course","name":"","description":"","price":0},{"category":"Main Course","name":"","description":"","price":0},{"category":"Beverages","name":"","description":"","price":0},{"category":"Beverages","name":"","description":"","price":0},{"category":"Desserts","name":"","description":"","price":0}],"pricingLogic":"","avgOrderValue":0,"dailyOrders":0,"monthlyRevenue":0,"breakEvenMonths":0,"setupCost":0,"monthlyOpex":0,"launchStrategy":"","openingOffer":"","instaPosts":[{"concept":"","caption":""},{"concept":"","caption":""},{"concept":"","caption":""}],"aiSummary":""}

Rules: scale all numbers to budget. Menu prices must match vibe. Be specific, realistic, not generic.`;

    try {
      const raw = await groq(prompt, 2000, () => buildLocalPlan(form));
      const parsed=JSON.parse(raw);
      clearInterval(stepIv.current);
      setPlan(parsed); writeLocal("business-plan", { plan: parsed, form }); setPhase("plan");
    } catch(e) {
      clearInterval(stepIv.current);
      setError(e.message); setPhase("error");
    }
  };

  const handlePDF=async()=>{

    setPdfLoad(true);
    try { await downloadPDF(plan,form); } catch(e) { alert("PDF error: "+e.message); }
    setPdfLoad(false);
  };

  const handleShare=()=>{
    const url = getShareURL(plan, form);
    if (!url) return;
    navigator.clipboard.writeText(url).then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false), 2500);
    });
  };

  const reset=()=>{ setPlan(null); setPhase("input"); setError(""); window.history.replaceState({},"",window.location.pathname); };

  const Field=({label,children})=>(
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      <Label>{label}</Label>{children}
    </div>
  );

  return (
    <>
      <FontLink/>
      <style>{globalCss}</style>
      <div className="business-studio" style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",color:T.text}}>

        {/* Topbar */}
        <div style={{borderBottom:`0.5px solid ${T.border}`,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:T.bgCard,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,background:T.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🍽</div>
            <span style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:700,color:T.cream}}>OriginBite Studio</span>
            <span style={{fontSize:11,background:T.accentBg,color:T.accent,padding:"2px 8px",borderRadius:10,fontFamily:"'DM Mono',monospace"}}>PLAN GEN v3</span>
          </div>
          {phase==="plan" && (
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={handleShare} style={{
                padding:"8px 16px",background:copied?T.successBg:T.accentBg,
                border:`0.5px solid ${copied?T.success:T.accent}`,borderRadius:8,
                fontSize:12,color:copied?T.success:T.accent,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all 0.2s",
              }}>{copied ? "✓ Copied!" : "🔗 Share plan"}</button>
              <button onClick={handlePDF} disabled={pdfLoading} style={{
                padding:"8px 16px",background:pdfLoading?T.border:T.accentBg,
                border:`0.5px solid ${pdfLoading?T.border:T.accent}`,borderRadius:8,
                fontSize:12,color:pdfLoading?T.muted:T.accent,cursor:pdfLoading?"not-allowed":"pointer",
                fontFamily:"'DM Sans',sans-serif",fontWeight:500,
              }}>{pdfLoading?"Generating…":"⬇ Download PDF"}</button>
              <button onClick={reset} style={{padding:"8px 16px",background:"transparent",border:`0.5px solid ${T.borderLight}`,borderRadius:8,fontSize:12,color:T.textSub,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← New plan</button>
            </div>
          )}
        </div>

        <div style={{padding:'12px 24px',borderBottom:'1px solid '+T.border,color:T.textSub,fontSize:12,display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}><Link to="/user-dashboard" style={{color:T.accent}}>← Workspace</Link><span>{plan?.source === 'local-template' ? 'Local planning template · illustrative assumptions, not AI predictions' : 'AI when configured · local planning templates otherwise'}</span></div>
        {/* Input */}
        {phase==="input" && (
          <div style={{maxWidth:560,margin:"0 auto",padding:"3rem 1.5rem"}} className="fade-up">
            <div style={{marginBottom:"2.5rem",textAlign:"center"}}>
              <h1 style={{fontFamily:"'Lora',serif",fontSize:32,fontWeight:700,color:T.cream,marginBottom:10,lineHeight:1.2}}>
                Build your restaurant<br/><span style={{color:T.accent}}>business plan</span>
              </h1>
              <p style={{fontSize:14,color:T.textSub,lineHeight:1.7}}>Concept, menu, financials, competitor research, what-if scenarios and a critical review — together in one plan.</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <Field label="Budget (₹)">
                  <input type="number" value={form.budget} onChange={set("budget")} placeholder="e.g. 800000"
                    style={{...inputStyle,borderColor:focusField==="budget"?T.accent:T.borderLight}}
                    onFocus={()=>setFocus("budget")} onBlur={()=>setFocus(null)}/>
                </Field>
                <Field label="City">
                  <input type="text" value={form.city} onChange={set("city")} placeholder="e.g. Mumbai"
                    style={{...inputStyle,borderColor:focusField==="city"?T.accent:T.borderLight}}
                    onFocus={()=>setFocus("city")} onBlur={()=>setFocus(null)}/>
                </Field>
              </div>
              <Field label="Area / Neighbourhood">
                <input type="text" value={form.area} onChange={set("area")} placeholder="e.g. Andheri East, Koramangala"
                  style={{...inputStyle,borderColor:focusField==="area"?T.accent:T.borderLight}}
                  onFocus={()=>setFocus("area")} onBlur={()=>setFocus(null)}/>
              </Field>
              <Field label="Restaurant vibe">
                <select value={form.vibe} onChange={set("vibe")}
                  style={{...inputStyle,borderColor:focusField==="vibe"?T.accent:T.borderLight,cursor:"pointer"}}
                  onFocus={()=>setFocus("vibe")} onBlur={()=>setFocus(null)}>
                  <option>Fast casual (affordable but modern)</option>
                  <option>Fine dining (premium, intimate)</option>
                  <option>Cloud kitchen (delivery-only, low overhead)</option>
                  <option>Café (work-friendly, all-day)</option>
                  <option>Street food (quick, cheap, high volume)</option>
                  <option>Health &amp; wellness (clean eating)</option>
                  <option>Bar &amp; grill (nightlife, social)</option>
                </select>
              </Field>
              <Field label="Cuisine preference (optional)">
                <input type="text" value={form.cuisine} onChange={set("cuisine")} placeholder="e.g. Indian fusion, Italian, pan-Asian…"
                  style={{...inputStyle,borderColor:focusField==="cuisine"?T.accent:T.borderLight}}
                  onFocus={()=>setFocus("cuisine")} onBlur={()=>setFocus(null)}/>
              </Field>
              <button onClick={generate} disabled={!form.budget||!form.city||!form.area}
                style={{marginTop:8,padding:"14px",background:(!form.budget||!form.city||!form.area)?T.border:T.accent,color:(!form.budget||!form.city||!form.area)?T.muted:"#0c1913",border:"none",borderRadius:12,fontSize:15,fontWeight:600,cursor:(!form.budget||!form.city||!form.area)?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.02em"}}
                onMouseDown={e=>e.currentTarget.style.transform="scale(0.98)"}
                onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                Generate business plan →
              </button>
            </div>
            <div style={{marginTop:24,display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
              {["MealDB images","Competitor radar","Roast me 🔥","What-if simulator","12-mo projections","Share plan 🔗","PDF export"].map(t=>(
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {phase==="loading" && <Loader step={loaderStep}/>}

        {/* Error */}
        {phase==="error" && (
          <div style={{maxWidth:480,margin:"3rem auto",padding:"0 1.5rem"}} className="fade-up">
            <div style={{background:T.errorBg,border:`0.5px solid ${T.error}50`,borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:500,color:T.error,marginBottom:6}}>Generation failed</div>
              <p style={{fontSize:13,color:"#e88",lineHeight:1.6}}>{errorMsg}</p>
            </div>
            <button onClick={reset} style={{background:"transparent",border:`0.5px solid ${T.borderLight}`,borderRadius:10,padding:"10px 18px",fontSize:13,color:T.textSub,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Try again</button>
          </div>
        )}

        {/* Plan */}
        {phase==="plan" && plan && (
          <div style={{maxWidth:900,margin:"0 auto",padding:"2rem 1.5rem"}}>

            {/* Brand header */}
            <div className="fade-up" style={{background:T.bgCard,border:`0.5px solid ${T.border}`,borderRadius:20,padding:"1.75rem 2rem",marginBottom:"1.75rem",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,right:0,width:200,height:200,background:`radial-gradient(circle at top right,${T.accentBg} 0%,transparent 70%)`,pointerEvents:"none"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
                <div>
                  <h2 style={{fontFamily:"'Lora',serif",fontSize:30,fontWeight:700,color:T.cream,marginBottom:4}}>{plan.restaurantName}</h2>
                  <p style={{fontSize:14,color:T.accent,fontStyle:"italic",marginBottom:14}}>"{plan.tagline}"</p>
                  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                    <Pill>{plan.theme}</Pill>
                    <Pill color="#0D1A10" textColor="#4CAF7A">{plan.brandPersonality}</Pill>
                    <Pill color="#080D1A" textColor="#6B9FE4">{form.city}, {form.area}</Pill>
                  </div>
                </div>
                <div>
                  <Label style={{display:"block",marginBottom:8}}>Brand colours</Label>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {(plan.colorPalette||[]).map((c,i)=>(
                      <div key={i} title={(plan.colorNames||[])[i]||c} style={{width:32,height:32,borderRadius:8,background:c,border:"0.5px solid #ffffff20",boxShadow:`0 0 10px ${c}60`}}/>
                    ))}
                  </div>
                  {plan.colorNames && (
                    <div style={{display:"flex",gap:8,marginTop:5}}>
                      {plan.colorNames.map((n,i)=>(<span key={i} style={{fontSize:10,color:T.muted,fontFamily:"'DM Mono',monospace"}}>{n}</span>))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="fade-up-2" style={{display:"flex",gap:3,marginBottom:"1.5rem",background:T.bgCard,border:`0.5px solid ${T.border}`,borderRadius:14,padding:5,flexWrap:"wrap"}}>
              {TABS.map(tab=>(
                <button key={tab.id} onClick={()=>setTab(tab.id)} style={{
                  flex:1,minWidth:72,padding:"8px 8px",
                  background:activeTab===tab.id?T.accent:"transparent",
                  color:activeTab===tab.id?"#0c1913":T.muted,
                  border:"none",borderRadius:10,fontSize:11,
                  fontWeight:activeTab===tab.id?600:400,
                  cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                }}>
                  <span style={{fontSize:10}}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="fade-up-3">
              {activeTab==="concept"     && <ConceptTab d={plan}/>}
              {activeTab==="menu"        && <MenuTab d={plan}/>}
              {activeTab==="financials"  && <FinancialsTab d={plan} budget={form.budget}/>}
              {activeTab==="location"    && <LocationTab d={plan}/>}
              {activeTab==="marketing"   && <MarketingTab d={plan} plan={form}/>}
              {activeTab==="competitors" && <CompetitorsTab plan={plan} form={form}/>}
              {activeTab==="whatif"      && <WhatIfTab plan={plan} form={form}/>}
              {activeTab==="roast"       && <RoastTab plan={plan} form={form}/>}
              {activeTab==="summary"     && <SummaryTab d={plan}/>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}