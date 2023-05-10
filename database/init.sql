-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 192.168.99.4:3306
-- Generation Time: May 10, 2023 at 09:57 AM
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`pages_id`, `pages_slug`, `pages_view`, `pages_last_update`, `pages_status_showing`, `pages_detail`) VALUES
(1, 'one_piece', 1, '2023-05-10 09:56:55.909355', 'จันทร์', '{\"tags\": {\"name\": \"ต่อสู้\"}, \"title\": \"One_piece\", \"resolution\": \"4K\", \"description\": \"การ์ตูนวันพีช สนุกสุดมัน\"}'),
(2, 'The_Great_Mage_Returns_After_4000_Years', 0, '2023-05-10 09:56:59.519033', 'อังคาร', '{\"tags\": {\"name\": \"ต่อสู้\"}, \"title\": \"The Great Mage Returns After 4000 Years\", \"resolution\": \"4K\", \"description\": \"The Great Mage Returns After 4000 Years สนุกสุดมัน\"}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`pages_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `pages_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
