-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 05, 2026 at 08:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medical_records`
--

-- --------------------------------------------------------

--
-- Table structure for table `allergies`
--

CREATE TABLE `allergies` (
  `allergy_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `allergy_type` enum('Drug','Food','Other') DEFAULT NULL,
  `allergy_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `allergies`
--

INSERT INTO `allergies` (`allergy_id`, `patient_id`, `allergy_type`, `allergy_name`) VALUES
(5, 3, 'Drug', 'Grod'),
(6, 3, NULL, NULL),
(7, 13, 'Food', 'Crab'),
(8, 13, 'Drug', 'Shabu');

-- --------------------------------------------------------

--
-- Table structure for table `consultation`
--

CREATE TABLE `consultation` (
  `consultation_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `consultation_date` datetime DEFAULT current_timestamp(),
  `chief_complaint` text NOT NULL,
  `history_of_present_illness` text NOT NULL,
  `physician_note` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consultation`
--

INSERT INTO `consultation` (`consultation_id`, `patient_id`, `consultation_date`, `chief_complaint`, `history_of_present_illness`, `physician_note`) VALUES
(31, 8, '2026-06-25 07:10:30', 'Pregnancy', 'Stress', 'Mini labor'),
(32, 9, '2026-06-25 09:07:53', 'Fever and Headache', 'Patient experienced fever for 3 days with mild headache and fatigue.', 'Prescribed paracetamol and advised rest and hydration.'),
(34, 13, '2026-06-27 20:21:06', 'naay bata', 'nag suka', 'ipa inom tambal'),
(35, 14, '2026-06-28 09:56:36', 'sqwq', 'wqw', 'wqw');

-- --------------------------------------------------------

--
-- Table structure for table `family_history`
--

CREATE TABLE `family_history` (
  `family_history_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `condition_name` varchar(100) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gynecologic_history`
--

CREATE TABLE `gynecologic_history` (
  `gyne_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `lmp` date DEFAULT NULL,
  `menarche_age` int(11) DEFAULT NULL,
  `cycle_type` enum('Regular','Irregular') DEFAULT NULL,
  `cycle_duration` int(11) DEFAULT NULL,
  `dysmenorrhea` tinyint(1) DEFAULT NULL,
  `gravidity` int(11) DEFAULT 0,
  `parity` int(11) DEFAULT 0,
  `abortion_count` int(11) DEFAULT 0,
  `living_children` int(11) DEFAULT 0,
  `delivery_type` enum('NSVD','CS','Both') DEFAULT NULL,
  `contraception` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gynecologic_history`
--

INSERT INTO `gynecologic_history` (`gyne_id`, `patient_id`, `lmp`, `menarche_age`, `cycle_type`, `cycle_duration`, `dysmenorrhea`, `gravidity`, `parity`, `abortion_count`, `living_children`, `delivery_type`, `contraception`) VALUES
(1, 3, NULL, NULL, NULL, NULL, 0, 0, 2, 2, 4, NULL, NULL),
(2, 3, NULL, NULL, NULL, NULL, 0, 0, 2, 2, 4, NULL, NULL),
(4, 23, '2026-05-11', 13, NULL, NULL, 1, 2, 1, 0, 0, NULL, NULL),
(5, 24, '2026-05-11', 14, NULL, NULL, 1, 3, 1, 1, 0, NULL, NULL),
(6, 25, '2026-05-20', 14, NULL, NULL, 0, 3, 0, 4, 0, NULL, NULL),
(7, 26, '2026-06-22', 12, NULL, NULL, 1, 0, 0, 0, 0, NULL, NULL),
(8, 30, '2026-04-22', 13, NULL, NULL, 0, 3, 1, 1, 0, NULL, NULL),
(9, 42, '2026-04-26', 13, NULL, NULL, 1, 3, 2, 0, 0, NULL, 'depo for 9 years, pills for 1 year');

-- --------------------------------------------------------

--
-- Table structure for table `hospitalizations`
--

CREATE TABLE `hospitalizations` (
  `hospitalization_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `hospitalization_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medical_conditions`
--

CREATE TABLE `medical_conditions` (
  `condition_id` int(11) NOT NULL,
  `condition_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_conditions`
--

INSERT INTO `medical_conditions` (`condition_id`, `condition_name`) VALUES
(1, 'Hypertension'),
(2, 'Diabetes Mellitus'),
(3, 'Asthma'),
(4, 'Thyroid Disease'),
(5, 'Heart Disease'),
(6, 'Kidney Disease'),
(7, 'Liver Disease'),
(8, 'Tuberculosis'),
(9, 'Cancer'),
(10, 'Bleeding Disorder'),
(11, 'Psychiatric Illness');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `patient_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_num` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`patient_id`, `first_name`, `last_name`, `birth_date`, `age`, `address`, `contact_num`, `created_at`) VALUES
(12, 'Janna', 'Doe', '1995-01-25', 31, 'Blgy7', '0987654321', '2026-06-26 05:42:56'),
(16, 'Maria', 'Mercedes ', '1990-06-03', 36, 'Blgy 4', '0916472638', '2026-06-28 02:04:42'),
(17, ' Ruffavie', 'Agpalza', '2001-06-02', 25, 'Balangay 2', '09976813268', '2026-06-28 02:20:53'),
(18, 'Ailyn', 'Lopez', '1983-01-16', 43, NULL, '', '2026-06-28 02:37:42'),
(19, 'Charon', 'Berito', '2000-07-10', 25, NULL, '', '2026-06-28 03:16:30'),
(20, 'Cecille', 'Alicaya ', '1992-10-10', 33, NULL, '', '2026-06-28 03:26:02'),
(21, 'Jenalyn', 'Ocon', '1996-11-12', 29, NULL, '', '2026-06-28 05:33:19'),
(22, 'Arrine', 'Tiongco', '1999-12-22', 26, NULL, '', '2026-06-28 05:34:07'),
(23, 'Caren', 'Moncada', '1997-01-15', 29, NULL, '', '2026-06-28 05:51:07'),
(24, 'Geneva', 'Doño', '1998-07-11', 27, NULL, '', '2026-06-28 05:52:12'),
(25, 'Glayzade', 'Armecin', '1995-12-31', 30, NULL, '', '2026-06-28 06:31:01'),
(26, 'Lenielyn', 'Allosada', '1997-05-15', 29, NULL, '', '2026-06-28 06:58:18'),
(27, 'Jeanrose', 'Dosdos', '1996-08-11', 29, NULL, '', '2026-06-28 07:54:18'),
(28, 'Meljoy', 'Camomot', '2005-04-10', 21, NULL, '', '2026-06-28 07:54:53'),
(29, 'Kristelle', 'Navismos ', '1995-06-02', 31, NULL, '', '2026-06-28 09:35:06'),
(30, 'Aiza Mea ', 'Naraga', '1991-04-15', 35, NULL, '', '2026-06-28 09:35:50'),
(31, 'Mary Jean', 'Laquido', '1995-09-19', 30, NULL, '', '2026-06-28 09:36:28'),
(32, 'Hayvie', 'Jogar', '1994-02-17', 32, NULL, '', '2026-06-28 09:37:02'),
(33, 'Trisa', 'New', '2004-05-15', 22, NULL, '', '2026-06-29 03:55:18'),
(34, 'Baticaros', 'Rowena', '2003-10-10', 22, NULL, '', '2026-06-29 04:52:29'),
(35, 'Ria', 'Bartido', '2001-06-09', 25, NULL, '', '2026-06-29 04:53:33'),
(36, 'Sarah Jane', 'Laguna', '1996-02-26', 30, NULL, '', '2026-06-29 04:54:15'),
(37, 'Vanessa Jane', 'Omam', '2007-11-02', 18, NULL, '', '2026-06-29 04:58:42'),
(38, 'Janice', 'Pajo', '0000-00-00', 0, NULL, '', '2026-06-29 08:15:01'),
(39, 'Honeylyn', 'Figueras', '1998-05-13', 28, NULL, '', '2026-06-30 01:52:56'),
(40, 'Allea Mea', 'Mercader', '1999-05-11', 27, NULL, '', '2026-07-01 00:29:03'),
(41, 'Rizza Joy', 'Polinar', '1992-03-04', 34, NULL, '', '2026-07-01 01:15:45'),
(42, 'Jean', 'Leopoldo', '1997-01-09', 29, NULL, '', '2026-07-01 01:43:28'),
(43, 'Ricelgin', 'Gunhuran', '0000-00-00', NULL, NULL, '', '2026-07-01 06:51:43'),
(44, 'Shiela Mea', 'Basilgo', '2000-03-01', 26, NULL, '', '2026-07-01 06:53:15'),
(45, 'Lovely Mea ', 'Cobe ', '1999-03-02', 27, NULL, '', '2026-07-03 00:24:08'),
(46, 'Margie ', 'Abrez', '1997-03-01', 29, NULL, '', '2026-07-03 00:26:58'),
(47, 'Kimberly', 'Sevilla ', '2007-10-06', 18, NULL, '', '2026-07-03 00:28:35'),
(48, 'Jessa Mae', 'Cantorne ', '2002-12-25', 23, NULL, '', '2026-07-03 00:29:22'),
(49, 'Jessa ', 'Quilaton ', '1999-04-09', 27, NULL, '', '2026-07-03 01:09:09'),
(50, 'Rica Mae', 'Botilla', '1996-05-12', 30, NULL, '', '2026-07-03 05:19:17'),
(51, 'Lalaine ', 'Garcesa ', '1988-10-18', 37, NULL, '', '2026-07-03 07:30:12'),
(52, 'Cudal', 'Chenne Rexette', '2000-01-01', 26, NULL, '', '2026-07-03 07:53:10');

-- --------------------------------------------------------

--
-- Table structure for table `patient_medical_history`
--

CREATE TABLE `patient_medical_history` (
  `history_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `condition_id` int(11) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_medical_history`
--

INSERT INTO `patient_medical_history` (`history_id`, `patient_id`, `condition_id`, `remarks`) VALUES
(92, 9, 3, 'Minus Virus'),
(93, 9, 5, 'Minus Virus'),
(94, 9, 7, 'Minus Virus'),
(95, 9, 11, 'Minus Virus'),
(96, 9, 5, 'Virus'),
(97, 9, 6, 'Virus'),
(98, 9, 7, 'Virus'),
(99, 14, 4, 'Hello'),
(100, 14, 6, 'Hello');

-- --------------------------------------------------------

--
-- Table structure for table `review_of_systems`
--

CREATE TABLE `review_of_systems` (
  `ros_id` int(11) NOT NULL,
  `consultation_id` int(11) DEFAULT NULL,
  `fever` tinyint(1) DEFAULT NULL,
  `weight_loss` tinyint(1) DEFAULT NULL,
  `headache` tinyint(1) DEFAULT NULL,
  `chest_pain` tinyint(1) DEFAULT NULL,
  `shortness_of_breath` tinyint(1) DEFAULT NULL,
  `abdominal_pain` tinyint(1) DEFAULT NULL,
  `urinary_symptoms` tinyint(1) DEFAULT NULL,
  `vaginal_bleeding_discharge` tinyint(1) DEFAULT NULL,
  `others` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review_of_systems`
--

INSERT INTO `review_of_systems` (`ros_id`, `consultation_id`, `fever`, `weight_loss`, `headache`, `chest_pain`, `shortness_of_breath`, `abdominal_pain`, `urinary_symptoms`, `vaginal_bleeding_discharge`, `others`) VALUES
(1, 11, 0, 1, 1, 1, 0, 1, 0, 0, 'Malaria'),
(2, 13, 0, 0, 0, 0, 0, 0, 0, 0, NULL),
(3, 19, 0, 0, 0, 1, 0, 0, 0, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `social_history`
--

CREATE TABLE `social_history` (
  `social_history_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `smoking` tinyint(1) DEFAULT 0,
  `sticks_per_day` int(11) DEFAULT NULL,
  `smoking_years` int(11) DEFAULT NULL,
  `alcohol` tinyint(1) DEFAULT 0,
  `alcohol_details` varchar(255) DEFAULT NULL,
  `illicit_drugs` tinyint(1) DEFAULT 0,
  `drug_details` varchar(255) DEFAULT NULL,
  `diet` text DEFAULT NULL,
  `exercise` enum('None','Occasional','Regular') DEFAULT NULL,
  `living_situation` varchar(100) DEFAULT NULL,
  `exposure_history` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `surgeries`
--

CREATE TABLE `surgeries` (
  `surgery_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `surgery_name` varchar(255) DEFAULT NULL,
  `surgery_date` date DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vital_signs`
--

CREATE TABLE `vital_signs` (
  `vital_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `consultation_id` int(11) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `bmi` decimal(5,2) DEFAULT NULL,
  `blood_pressure` varchar(10) DEFAULT NULL,
  `pulse_rate` int(11) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `oxygen_saturation` int(11) DEFAULT NULL,
  `pain_scale` tinyint(4) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vital_signs`
--

INSERT INTO `vital_signs` (`vital_id`, `patient_id`, `consultation_id`, `weight`, `height`, `bmi`, `blood_pressure`, `pulse_rate`, `respiratory_rate`, `temperature`, `oxygen_saturation`, `pain_scale`, `recorded_at`) VALUES
(1, 12, NULL, 49.00, 162.56, 18.54, '52', 3, 4, 2.0, -2, 4, '2026-06-26 22:28:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allergies`
--
ALTER TABLE `allergies`
  ADD PRIMARY KEY (`allergy_id`),
  ADD KEY `allergies_ibfk_1` (`patient_id`);

--
-- Indexes for table `consultation`
--
ALTER TABLE `consultation`
  ADD PRIMARY KEY (`consultation_id`),
  ADD UNIQUE KEY `unique_patient` (`patient_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `family_history`
--
ALTER TABLE `family_history`
  ADD PRIMARY KEY (`family_history_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `gynecologic_history`
--
ALTER TABLE `gynecologic_history`
  ADD PRIMARY KEY (`gyne_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `hospitalizations`
--
ALTER TABLE `hospitalizations`
  ADD PRIMARY KEY (`hospitalization_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `medical_conditions`
--
ALTER TABLE `medical_conditions`
  ADD PRIMARY KEY (`condition_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `patient_medical_history`
--
ALTER TABLE `patient_medical_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `condition_id` (`condition_id`);

--
-- Indexes for table `review_of_systems`
--
ALTER TABLE `review_of_systems`
  ADD PRIMARY KEY (`ros_id`);

--
-- Indexes for table `social_history`
--
ALTER TABLE `social_history`
  ADD PRIMARY KEY (`social_history_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `surgeries`
--
ALTER TABLE `surgeries`
  ADD PRIMARY KEY (`surgery_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `vital_signs`
--
ALTER TABLE `vital_signs`
  ADD PRIMARY KEY (`vital_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allergies`
--
ALTER TABLE `allergies`
  MODIFY `allergy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `consultation`
--
ALTER TABLE `consultation`
  MODIFY `consultation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `family_history`
--
ALTER TABLE `family_history`
  MODIFY `family_history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `gynecologic_history`
--
ALTER TABLE `gynecologic_history`
  MODIFY `gyne_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `hospitalizations`
--
ALTER TABLE `hospitalizations`
  MODIFY `hospitalization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `medical_conditions`
--
ALTER TABLE `medical_conditions`
  MODIFY `condition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `patient_medical_history`
--
ALTER TABLE `patient_medical_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `review_of_systems`
--
ALTER TABLE `review_of_systems`
  MODIFY `ros_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `social_history`
--
ALTER TABLE `social_history`
  MODIFY `social_history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `surgeries`
--
ALTER TABLE `surgeries`
  MODIFY `surgery_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vital_signs`
--
ALTER TABLE `vital_signs`
  MODIFY `vital_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
