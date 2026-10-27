import axios from "axios";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

import { MdFace2, MdOutlineLocalGroceryStore, MdOutlineSportsSoccer } from "react-icons/md";
import { GiAmpleDress, GiConverseShoe, GiFragmentedMeteor, GiFurnace, GiSunglasses, GiTravelDress } from "react-icons/gi";
import { CiHome, CiLaptop, CiMobile1 } from "react-icons/ci";
import { FaKitchenSet } from "react-icons/fa6";
import { IoManSharp } from "react-icons/io5";
import { IoMdWatch } from "react-icons/io";
import { AiTwotoneSkin } from "react-icons/ai";
import { PiDressThin } from "react-icons/pi";
import { FaShoppingBag } from "react-icons/fa";

export default function CategoryList() {

    const categoryIcons = {
    "beauty": MdFace2,
    "fragrances": GiFragmentedMeteor,
    "furniture": GiFurnace,
    "groceries": MdOutlineLocalGroceryStore,
    "home-decoration": CiHome,
    "kitchen-accessories": FaKitchenSet,
    "laptops": CiLaptop,
    "mens-shirts": IoManSharp,
    "mens-shoes": GiConverseShoe,
    "mens-watches": IoMdWatch,
    "mobile-accessories": CiMobile1,
    "motorcycle": MdFace2,
    "skin-care": AiTwotoneSkin,
    "smartphones": CiMobile1,
    "sports-accessories": MdOutlineSportsSoccer,
    "sunglasses": GiSunglasses,
    "tablets": CiMobile1,
    "tops": PiDressThin,
    "vehicle": MdOutlineSportsSoccer,
    "womens-bags": FaShoppingBag,
    "womens-dresses": GiTravelDress,
    "womens-jewellery": GiAmpleDress,
    "womens-shoes": GiConverseShoe,
    "womens-watches": IoMdWatch,
  };



  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const URL = "https://dummyjson.com/products/categories";

      try {
        const response = await axios.get(URL);
        setCategories(response.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCategories();
  }, []);
  return (
    <Swiper
      loop={true}
      className="mb-4 mt-2"
      modules={[ Autoplay ]}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      spaceBetween={20}
      breakpoints={{
        0: {
            slidesPerView: 2,
        },
        798: {
            slidesPerView: 4,
        },
        1200: {
            slidesPerView: 6,
        },
      }}
    >
   {categories.map((category, index) => {
    const Icon = categoryIcons[category.slug];
    return(<SwiperSlide key={index}><Icon size={30}/>{category.name}</SwiperSlide>)
   })}
    </Swiper>
  );
}
