-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: May 13, 2023 at 09:52 AM
-- Server version: 5.7.42
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `pages_id` int(10) NOT NULL,
  `pages_slug` varchar(1000) NOT NULL,
  `pages_view` int(100) NOT NULL,
  `pages_last_update` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `pages_status_showing` varchar(100) NOT NULL,
  `pages_detail` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`pages_id`, `pages_slug`, `pages_view`, `pages_last_update`, `pages_status_showing`, `pages_detail`) VALUES
(1, 'Nano_Machine', 1, '2023-05-13 01:31:35.579655', 'จันทร์', '{\"info\": {\"EN\": \"Nano Machine\", \"TH\": \"นาโนมาชิน\", \"star\": \"8\", \"type\": \"Novel\", \"follow\": \"453\", \"publish\": \"2022\", \"status_showing\": \"วันอังคาร\"}, \"tags\": \"Action,Fantasy,Revenge,Sci-Fi\", \"title\": \"นิยาย Nano Machine | นาโนมาชิน\", \"simple\": \"นิยาย Nano Machine เรื่องย่อ Nano Machine แปลไทย เรื่องราวของชอนยออุนลูกนอกสมรสภายในพรรคมารที่ได้เป็นเทวบุตรมารรุ่นที่ 2 และอยู่เหนือประมุขพรรคมาร หน้าแรก | อ่าน Nano Machine แปลไทย\", \"last_ep\": 297, \"thumbnail\": \"https://rose-manga.com/wp-content/uploads/2022/04/nanov2_cover.jpg\", \"resolution\": \"4K\", \"description\": \"นิยาย Nano Machine เรื่องย่อ Nano Machine แปลไทย เรื่องราวของชอนยออุนลูกนอกสมรสภายในพรรคมารที่ได้เป็นเทวบุตรมารรุ่นที่ 2 และอยู่เหนือประมุขพรรคมาร หน้าแรก | อ่าน Nano Machine แปลไทย\", \"last_update\": \"2023-05-10 00:00:00\"}'),
(2, 'Omniscient_Reader', 0, '2023-05-13 01:31:49.394953', 'อังคาร', '{\"info\": {\"EN\": \"Omniscient Reader\", \"TH\": \"อ่านชะตาวันสิ้นโลก\", \"star\": \"10\", \"type\": \"Manhwa\", \"follow\": \"85\", \"publish\": \"2022\", \"status_showing\": \"วันเสาร์\"}, \"tags\": \"Action,Fantasy,Sci-Fi\", \"title\": \"Omniscient Reader อ่านชะตาวันสิ้นโลก\", \"simple\": \"ดกจาเป็นพนักงานออฟฟิศทั่วไปที่มีความสนใจเพียงเรื่องเดียวในการอ่านนวนิยายบนเว็บเรื่องโปรดของเขา ‘Three Ways to Survive the Apocalypse’ แต่เมื่อจู่ๆ นิยายเรื่องนี้กลายเป็นความจริง เขาก็เป็นเพียงคนเดียวที่รู้ว่าโลกจะจบลงอย่างไร ด้วยความเข้าใจนี้ ดกจาจึงใช้ความเข้าใจของเขาในการเปลี่ยนเส้นทางของเรื่องราวและโลกตามที่เขารู้\", \"last_ep\": 156, \"thumbnail\": \"https://rose-manga.com/wp-content/uploads/2022/06/kim-dokja.webp\", \"resolution\": \"4K\", \"description\": \"Synopsis Omniscient Reader อ่านชะตาวันสิ้นโลก ดกจาเป็นพนักงานออฟฟิศทั่วไปที่มีความสนใจเพียงเรื่องเดียวในการอ่านนวนิยายบนเว็บเรื่องโปรดของเขา ‘Three Ways to Survive the Apocalypse’ แต่เมื่อจู่ๆ นิยายเรื่องนี้กลายเป็นความจริง เขาก็เป็นเพียงคนเดียวที่รู้ว่าโลกจะจบลงอย่างไร ด้วยความเข้าใจนี้ ดกจาจึงใช้ความเข้าใจของเขาในการเปลี่ยนเส้นทางของเรื่องราวและโลกตามที่เขารู้\", \"last_update\": \"2023-05-06 00:00:00\"}'),
(3, 'The_World_After_The_End', 3, '2023-05-13 01:32:34.828694', 'พุธ', '{\"info\": {\"EN\": \"The World After the end\", \"TH\": \"โลกหลังการล่มสลาย\", \"star\": \"7\", \"type\": \"Manhwa\", \"follow\": \"15\", \"publish\": \"2022\", \"status_showing\": \"วันศุกร์\"}, \"tags\": \"Action,Fantasy,Revenge\", \"title\": \"The World After the End โลกหลังการล่มสลาย\", \"simple\": \"เมื่อต้องเผชิญกับความพ่ายแพ้และความตายที่แน่นอน คุณจะเลือกวิ่ง – หรือต่อสู้เพื่อโลกที่พินาศต่อไป? เมื่อหอคอยลึกลับปรากฏขึ้นทั่วโลก เรียกสัตว์ประหลาดที่ล่ามนุษย์ นี่คือตัวเลือกที่นำเสนอแก่ Tower Walkers – นักผจญภัยที่มีพลังพิเศษในการต่อสู้กับสัตว์ประหลาด ในช่วงใกล้ตาย พวกเขาสามารถเลือกใช้ “หินถดถอย” เพื่อย้อนเวลากลับไปในอดีตเป็นโอกาสที่สอง แม้ว่าการตัดสินใจครั้งนี้จะทำให้พวกเขาอยู่ในไทม์ไลน์ที่แยกจากกันตลอดไป หัวแข็งทาวเวอร์วอล์คเกอร์ แจฮวานปฏิเสธตัวเลือกนี้ เลือกที่จะต่อสู้เพื่อไทม์ไลน์เดิม และเรียนรู้\", \"last_ep\": 71, \"thumbnail\": \"https://ped-manga.com/wp-content/uploads/2022/02/s.webp\", \"resolution\": \"4K\", \"description\": \"เรื่องย่อ The World After the end โลกหลังการล่มสลาย เมื่อต้องเผชิญกับความพ่ายแพ้และความตายที่แน่นอน คุณจะเลือกวิ่ง – หรือต่อสู้เพื่อโลกที่พินาศต่อไป? เมื่อหอคอยลึกลับปรากฏขึ้นทั่วโลก เรียกสัตว์ประหลาดที่ล่ามนุษย์ นี่คือตัวเลือกที่นำเสนอแก่ Tower Walkers – นักผจญภัยที่มีพลังพิเศษในการต่อสู้กับสัตว์ประหลาด ในช่วงใกล้ตาย พวกเขาสามารถเลือกใช้ “หินถดถอย” เพื่อย้อนเวลากลับไปในอดีตเป็นโอกาสที่สอง\", \"last_update\": \"2023-05-05 00:00:00\"}');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `posts_id` int(100) NOT NULL,
  `posts_ep` int(100) NOT NULL,
  `pages_id` int(100) NOT NULL,
  `posts_detail` json NOT NULL,
  `posts_views` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`posts_id`, `posts_ep`, `pages_id`, `posts_detail`, `posts_views`) VALUES
(1, 0, 1, '{\"image\": [{\"alt\": \"survival-9-8-65-00001\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00001.jpg\"}, {\"alt\": \"survival-9-8-65-00002\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00002.jpg\"}, {\"alt\": \"survival-9-8-65-00003\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00003.jpg\"}, {\"alt\": \"survival-9-8-65-00004\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00004.jpg\"}, {\"alt\": \"survival-9-8-65-00005\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00005.jpg\"}, {\"alt\": \"survival-9-8-65-00006\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00006.jpg\"}]}', 1),
(2, 1, 1, '{\"image\": [{\"alt\": \"survival-9-8-65-00008\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00008.jpg\"}, {\"alt\": \"survival-9-8-65-00009\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00009.jpg\"}, {\"alt\": \"survival-9-8-65-000010\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00010.jpg\"}, {\"alt\": \"survival-9-8-65-000011\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00011.jpg\"}, {\"alt\": \"survival-9-8-65-000012\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00012.jpg\"}, {\"alt\": \"survival-9-8-65-000013\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00013.jpg\"}, {\"alt\": \"survival-9-8-65-000014\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00014.jpg\"}, {\"alt\": \"survival-9-8-65-000015\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00015.jpg\"}, {\"alt\": \"survival-9-8-65-000016\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00016.jpg\"}, {\"alt\": \"survival-9-8-65-000017\", \"url\": \"https://img.soul-manga.com/r/survival-9-8-65-00017.jpg\"}]}', 1),
(3, 0, 2, '{\"image\": [{\"alt\": \"Wang Pai Shen Yi 0 1\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-1.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 2\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-2.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 3\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-3.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 4\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-4.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 5\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-5.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 6\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-6.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 1\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-7.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 2\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-8.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 3\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-0-9.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 4\", \"url\": \"https://1.soul-manga.com/4/img/2021/10/20/Wang-Pai-Shen-Yi-0-10.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 4\", \"url\": \"https://1.soul-manga.com/4/img/2021/10/20/Wang-Pai-Shen-Yi-0-11.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 14\", \"url\": \"https://1.soul-manga.com/4/img/2021/10/20/Wang-Pai-Shen-Yi-0-12.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 15\", \"url\": \"https://1.soul-manga.com/4/img/2021/10/20/Wang-Pai-Shen-Yi-0-13.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 14\", \"url\": \"https://1.soul-manga.com/4/img/2021/10/20/Wang-Pai-Shen-Yi-0-14.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 15\", \"url\": \"https://1.soul-manga.com/4/img/2021/10/20/Wang-Pai-Shen-Yi-0-15.jpg\"}]}', 1),
(4, 1, 2, '{\"image\": [{\"alt\": \"Wang Pai Shen Yi 0 1\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-1-1.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 2\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-1-2.jpg\"}, {\"alt\": \"Wang Pai Shen Yi 0 3\", \"url\": \"https://1.soul-manga.com/img/2021/10/20/Wang-Pai-Shen-Yi-1-3.jpg\"}]}', 1),
(5, 1, 3, '{\"image\": [{\"alt\": \"The-Greatest-in-the-World-1-01.jpg\", \"url\": \"https://7.soul-manga.com/images/The-Greatest-in-the-World-1-01.jpg\"}, {\"alt\": \"The-Greatest-in-the-World-1-02.jpg\", \"url\": \"https://7.soul-manga.com/images/The-Greatest-in-the-World-1-02.jpg\"}, {\"alt\": \"The-Greatest-in-the-World-1-03.jpg\", \"url\": \"https://7.soul-manga.com/images/The-Greatest-in-the-World-1-03.jpg\"}]}', 1),
(6, 2, 3, '{\"image\": [{\"alt\": \"The-Greatest-in-the-World-2-01.jpg\", \"url\": \"https://7.soul-manga.com/images/The-Greatest-in-the-World-2-01.jpg\"}, {\"alt\": \"The-Greatest-in-the-World-2-02.jpg\", \"url\": \"https://7.soul-manga.com/images/The-Greatest-in-the-World-2-02.jpg\"}, {\"alt\": \"The-Greatest-in-the-World-2-03.jpg\", \"url\": \"https://7.soul-manga.com/images/The-Greatest-in-the-World-2-03.jpg\"}]}', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`pages_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`posts_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `pages_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `posts_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
