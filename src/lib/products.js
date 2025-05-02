// Assuming Product is defined somewhere in your codebase
// import { Product } from "@/lib/types";

import Spinach from "@/public/images/Spinach.jpg";
import Spinach1 from "@/public/images/Spinach1.jpg";
import Spinach2 from "@/public/images/Spinach2.jpg";
import Spinach3 from "@/public/images/Spinach3.jpg";
import Spinach4 from "@/public/images/Spinach4.jpg";

import Mint from "@/public/images/Mint1.jpg";
import Mint1 from "@/public/images/Mint2.jpg";
import Mint2 from "@/public/images/Mint3.jpg";
import Mint3 from "@/public/images/Mint4.jpg";
import Mint4 from "@/public/images/Mint.jpg";

import Tomato from "@/public/images/Tomato.jpg";
import Tomato1 from "@/public/images/Tomato1.jpg";
import Tomato2 from "@/public/images/Tomato2.jpg";
import Tomato3 from "@/public/images/Tomato3.jpg";
import Tomato4 from "@/public/images/Tomato4.jpg";

import Brinjal from "@/public/images/Brinjal.jpg";
import Brinjal1 from "@/public/images/Brinjal1.jpg";
import Brinjal2 from "@/public/images/Brinjal2.jpg";
import Brinjal3 from "@/public/images/Brinjal3.jpg";
import Brinjal4 from "@/public/images/Brinjal4.jpg";

import Green_Chili from "@/public/images/GreenChili.jpg";
import Green_Chili1 from "@/public/images/GreenChili1.jpg";
import Green_Chili2 from "@/public/images/GreenChili2.jpg";
import Green_Chili3 from "@/public/images/GreenChili3.jpg";
import Green_Chili4 from "@/public/images/GreenChili4.jpg";

import Carrot from "@/public/images/carrot.jpg";
import Carrot1 from "@/public/images/carrot1.jpg";
import Carrot2 from "@/public/images/carrot2.jpg";
import Carrot3 from "@/public/images/carrot3.jpg";
import Carrot4 from "@/public/images/carrot4.jpg";

import Potato from "@/public/images/potato.jpg";
import Potato1 from "@/public/images/potato1.jpg";
import Potato2 from "@/public/images/potato2.jpg";
import Potato3 from "@/public/images/potato3.jpg";
import Potato4 from "@/public/images/potato4.jpg";

import Onion from "@/public/images/Onion.jpg";
import Onion1 from "@/public/images/Onion1.jpg";
import Onion2 from "@/public/images/Onion2.jpg";
import Onion3 from "@/public/images/Onion3.jpg";
import Onion4 from "@/public/images/Onion4.jpg";

import Garlic from "@/public/images/Garilic.jpg";
import Garlic1 from "@/public/images/Garilic1.jpg";
import Garlic2 from "@/public/images/Garilic2.jpg";
import Garlic3 from "@/public/images/Garilic3.jpg";
import Garlic4 from "@/public/images/Garilic4.jpg";

import Cabbage from "@/public/images/Cabbage.jpg";
import Cabbage1 from "@/public/images/Cabbage1.jpg";
import Cabbage2 from "@/public/images/Cabbage2.jpg";
import Cabbage3 from "@/public/images/Cabbage3.jpg";
import Cabbage4 from "@/public/images/Cabbage4.jpg";

import Cauliflower from "@/public/images/Cauliflower.jpg";
import Cauliflower1 from "@/public/images/Cauliflower1.jpg";
import Cauliflower2 from "@/public/images/Cauliflower2.jpg";
import Cauliflower3 from "@/public/images/Cauliflower3.jpg";
import Cauliflower4 from "@/public/images/Cauliflower4.jpg";

import Drumstick from "@/public/images/Drumstick.jpg";
import Drumstick1 from "@/public/images/Drumstick1.jpg";
import Drumstick2 from "@/public/images/Drumstick2.jpg";
import Drumstick3 from "@/public/images/Drumstick3.jpg";
import Drumstick4 from "@/public/images/Drumstick4.jpg";

import Cucumber from "@/public/images/Cucumber.jpg";
import Cucumber1 from "@/public/images/Cucumber1.jpg";
import Cucumber2 from "@/public/images/Cucumber2.jpg";
import Cucumber3 from "@/public/images/Cucumber3.jpg";
import Cucumber4 from "@/public/images/Cucumber4.jpg";

import Spring_Onion_Greens from "@/public/images/Spring Onion Greens.jpg";
import Spring_Onion_Greens1 from "@/public/images/Spring Onion Greens1.jpg";
import Spring_Onion_Greens2 from "@/public/images/Spring Onion Greens2.jpg";
import Spring_Onion_Greens3 from "@/public/images/Spring Onion Greens3.jpg";
import Spring_Onion_Greens4 from "@/public/images/Spring Onion Greens4.jpg";

import Mango from "@/public/images/Mango.jpg";
import Mango1 from "@/public/images/Mango1.jpg";
import Mango2 from "@/public/images/Mango2.jpg";
import Mango3 from "@/public/images/Mango3.jpg";
import Mango4 from "@/public/images/Mango4.jpg";

import Jamun from "@/public/images/Jamun.jpg";
import Jamun1 from "@/public/images/Jamun1.jpg";
import Jamun2 from "@/public/images/Jamun2.jpg";
import Jamun3 from "@/public/images/Jamun3.jpg";
import Jamun4 from "@/public/images/Jamun4.jpg";

import Watermelon from "@/public/images/Watermelon.jpg";
import Watermelon1 from "@/public/images/Watermelon1.jpg";
import Watermelon2 from "@/public/images/Watermelon2.jpg";
import Watermelon3 from "@/public/images/Watermelon3.jpg";
import Watermelon4 from "@/public/images/Watermelon4.jpg";

export const products = [
  {
    id: 1,
    name: "Organic Spinach",
    description: "Fresh, nutrient-rich organic spinach leaves. Perfect for salads, smoothies, or cooking.",
    price: 3.99,
    category: "leafy",
    unit: "250g bunch",
    stock: 15,
    discount: 0,
    featured: false,
    bestseller: true,
    seasonal: false,
    new: true,
     image: Spinach,
     image1: Spinach1,
     image2: Spinach2,
     image3: Spinach3,
     image4: Spinach4,
  },
   {
     id: 2,
     name: "Organic Mint",
     description: "Refreshing organic mint. Perfect for teas, cocktails, or garnishing.",
     price: 2.49,
     category: "leafy",
     unit: "500g pack",
     stock: 30,
     discount: 0,
     featured: true,
     bestseller: false,
     seasonal: false,
     new: false,
     image: Mint,
     image1: Mint1,
     image2: Mint2,
     image3: Mint3,
     image4: Mint4,
   },
   {
     id: 3,
     name: "Organic Tomatoes",
     description: "Juicy, vine-ripened organic tomatoes. Perfect for salads, sandwiches, or cooking.",
     price: 4.99,
     originalPrice: 5.99,
     category: "fruit",
     unit: "500g pack",
     stock: 25,
     discount: 15,
     featured: false,
     bestseller: true,
     seasonal: false,
     new: true,
     image: Tomato,
     image1: Tomato1,
     image2: Tomato2,
     image3: Tomato3,
     image4: Tomato4,
   },
   {
     id: 4,
     name: "Organic Brinjal",
     description: "Healthy, nutrient-rich organic brinjal. Perfect for salads, smoothies, or cooking.",
     price: 1.99,
     category: "fruit",
     unit: "1 Kg pack",
     stock: 40,
     discount: 0,
     featured: false,
     bestseller: true,
     seasonal: false,
     new: false,
     image: Brinjal,
     image1: Brinjal1,
     image2: Brinjal2,
     image3: Brinjal3,
     image4: Brinjal4,
   },
   {
     id: 5,
     name: "Organic Green Chili",
     description: "Juicy, nutrient-rich organic green chili. Perfect for salads, sandwiches, or cooking.",
     price: 3.49,
     category: "fruit",
     unit: "200g bunch",
     stock: 20,
     discount: 0,
     featured: true,
     bestseller: false,
     seasonal: true,
     new: true,
     image: Green_Chili,
     image1: Green_Chili1,
     image2: Green_Chili2,
     image3: Green_Chili3,
     image4: Green_Chili4,
   },
   {
     id: 6,
     name: "Organic Carrot",
     description: "Healthy, nutrient-rich organic carrots. Perfect for salads, smoothies, or cooking.",
     price: 4.99,
     category: "root",
     unit: "3 pack (red, yellow, green)",
     stock: 25,
     discount: 0,
     bestseller: true,
     featured: true,
     seasonal: false,
     new: false,
     image: Carrot,
     image1: Carrot1,
     image2: Carrot2,
     image3: Carrot3,
     image4: Carrot4,
   },
   {
     id: 7,
     name: "Organic Potatoes",
     description: "Versatile organic potatoes. Perfect for roasting, mashing, or frying.",
     price: 3.99,
     category: "root",
     unit: "1kg bag",
     stock: 50,
     discount: 0,
     featured: false,
     bestseller: true,
     seasonal: false,
     new: false,
     image: Potato,
     image1: Potato1,
     image2: Potato2,
     image3: Potato3,
     image4: Potato4,
   },
   {
     id: 8,
     name: " Organic Onion",
     description: "Juicy, nutrient-rich organic onions. Perfect for salads, sandwiches, or cooking.",
     price: 2.99,
     category: "root",
     unit: "Head",
     stock: 35,
     discount: 0,
     featured: true,
     bestseller: true,
     seasonal: false,
     new: false,
     image: Onion,
     image1: Onion1,
     image2: Onion2,
     image3: Onion3,
     image4: Onion4,
   },
   {
     id: 9,
     name: " Organic Garlic",
     description: "Juicy, nutrient-rich organic garlic. Perfect for salads, sandwiches, or cooking.",
     price: 2.49,
     category: "root",
     unit: "Head",
     stock: 30,
     discount: 0,
     featured: false,
     bestseller: true,
     seasonal: false,
     new: false,
     image: Garlic,
     image1: Garlic1,
     image2: Garlic2,
     image3: Garlic3,
     image4: Garlic4,
   },
   {
     id: 10,
     name: " Organic Cabbage",
     description: "Healthy, nutrient-rich organic cabbage. Perfect for salads, smoothies, or cooking.",
     price: 1.99,
     category: "herbs",
     unit: "500g bag",
     stock: 45,
     discount: 0,
     featured: true,
     bestseller: false,
     seasonal: true,
     new: true,
     image: Cabbage,
     image1: Cabbage1,
     image2: Cabbage2,
     image3: Cabbage3,
     image4: Cabbage4,
   },
   {
     id: 11,
     name: " Organic CauliFlower",
     description: "Healthy, nutrient-rich organic cauliflower. Perfect for salads, smoothies, or cooking.",
     price: 2.29,
     category: "herbs",
     unit: "3 bulb pack",
     stock: 40,
     discount: 0,
     featured: false,
     bestseller: true,
     seasonal: false,
     new: false,
     image: Cauliflower,
     image1: Cauliflower1,
     image2: Cauliflower2,
     image3: Cauliflower3,
     image4: Cauliflower4,
   },
   {
     id: 12,
     name: " Organic Drumstick",
     description: "Fragrant organic drumstick leaves. Ideal for soups, salads, and curries.",
     price: 1.79,
     category: "herbs",
     unit: "Bunch",
     stock: 25,
     discount: 0,
     new: true,
     featured: true,
     bestseller: false,
     seasonal: true,
     image: Drumstick,
     image1: Drumstick1,
     image2: Drumstick2,
     image3: Drumstick3,
     image4: Drumstick4,
   },
   {
     id: 13,
     name: " Organic Cucumber",
     description: "Juicy, nutrient-rich organic cucumber. Perfect for salads, sandwiches, or cooking.",
     price: 2.49,
     category: "herbs",
     unit: "Each",
     stock: 30,
     discount: 0,
     seasonal: true,
     featured: false,
     bestseller: true,
     new: false,
     image: Cucumber,
     image1: Cucumber1,
     image2: Cucumber2,
     image3: Cucumber3,
     image4: Cucumber4,
   },
   {
     id: 14,
     name: "Spring Onion Greens",
     description: "Fresh, nutrient-rich spring onion greens. Perfect for salads, smoothies, or cooking.",
     price: 3.49,
     originalPrice: 3.99,
     category: "herbs",
     unit: "500g pack",
     stock: 20,
     discount: 10,
     new: true,
     image: Spring_Onion_Greens,
     image1: Spring_Onion_Greens1,
     image2: Spring_Onion_Greens2,
     image3: Spring_Onion_Greens3,
     image4: Spring_Onion_Greens4,
   },
   {
     id: 15,
     name: "Organic Mango",
     description: "Sweet, juicy organic mango. Perfect for smoothies, desserts, or snacking.",
     price: 1.99,
     category: "fruit",
     unit: "Bunch",
     stock: 15,
     discount: 0,
     seasonal: true,
     featured: false,
     bestseller: true,
     new: false,
     image: Mango,   
     image1: Mango1,
     image2: Mango2,
     image3: Mango3,
     image4: Mango4,
   },
   {
     id: 16,
     name: "Fresh Jamun",
     description: "Juicy, nutrient-rich fresh jamun. Perfect for salads, sandwiches, or cooking.",
     price: 3.99,
     category: "fruit",
     unit: "Head",
     stock: 25,
     discount: 0,
     featured: true,
     bestseller: false,
     seasonal: true,
     new: true,
     image: Jamun,
     image1: Jamun1,
     image2: Jamun2,
     image3: Jamun3,
     image4: Jamun4,
   },
   {
     id: 17,
     name: "Organic Watermelon",
     description: "Juicy, nutrient-rich organic watermelon. Perfect for salads, sandwiches, or cooking.",
     price: 4.99,
     category: "fruit",
     unit: "500g pack",
     stock: 20,
     discount: 0,
     seasonal: true,
     featured: false,
     bestseller: true,
     new: false,
     image: Watermelon,
     image1: Watermelon1,
     image2: Watermelon2,
     image3: Watermelon3,
     image4: Watermelon4,
   },
   
];

