-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2026 at 03:14 PM
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
(1, 1, 'Food', 'Crab');

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
(11, 3, '2026-06-23 23:25:56', '8th weeks pregnant', 'Vommit', 'to be labor next week'),
(13, 1, '2026-06-24 21:08:13', 'SAqnmwh', 'wahwow', 'qeeqw'),
(15, 4, '2026-06-24 19:57:24', 'sq', 'qsq', 'qq');

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
(2, 3, NULL, NULL, NULL, NULL, 0, 0, 2, 2, 4, NULL, NULL);

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

--
-- Dumping data for table `hospitalizations`
--

INSERT INTO `hospitalizations` (`hospitalization_id`, `patient_id`, `details`, `hospitalization_date`) VALUES
(1, 1, NULL, NULL),
(2, 3, NULL, NULL),
(3, 3, NULL, NULL),
(4, 3, 'sqwqs', '2026-06-04'),
(5, 1, 'sqw', '2026-06-25'),
(6, 1, 'sqw', '2026-06-25');

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
(1, 'Jane', 'Doe', '2026-06-01', 25, 'Quezon Bukidnon', '09123456789', '2026-06-21 15:34:05'),
(2, 'Janna', 'Doer', '2026-06-03', 23, 'Quezon City', '09987654321', '2026-06-21 15:35:35'),
(3, 'Eliza', 'Maria', '1987-04-25', 39, NULL, '09528741963', '2026-06-23 14:39:38'),
(4, 'Rebecca', 'Laplap', '2000-01-05', 26, NULL, '0916582743', '2026-06-23 16:49:55'),
(5, 'Krystal', 'Lakambini', '1984-06-29', 41, 'Samar Leyte', '09123456778', '2026-06-23 16:56:00');

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
(1, 3, 2, 'High Risk'),
(2, 3, 4, 'High Risk'),
(3, 3, 5, 'High Risk'),
(4, 3, 7, 'High Risk'),
(5, 3, 4, 'Deceased'),
(6, 3, 5, 'Deceased'),
(7, 3, 6, 'Deceased'),
(8, 3, 10, 'Deceased'),
(9, 3, 1, 'Deceased'),
(10, 1, 6, ''),
(11, 1, 3, ''),
(12, 1, 8, ''),
(13, 1, 4, ''),
(14, 1, 10, ''),
(15, 1, 1, 'saqw'),
(16, 1, 2, 'saqw'),
(17, 1, 3, 'saqw'),
(18, 1, 9, 'saqw');

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
(2, 13, 0, 0, 0, 0, 0, 0, 0, 0, NULL);

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

--
-- Dumping data for table `social_history`
--

INSERT INTO `social_history` (`social_history_id`, `patient_id`, `smoking`, `sticks_per_day`, `smoking_years`, `alcohol`, `alcohol_details`, `illicit_drugs`, `drug_details`, `diet`, `exercise`, `living_situation`, `exposure_history`) VALUES
(1, 1, 1, 54, 4, 0, NULL, 0, NULL, NULL, NULL, 'gi', 'urturfr');

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

--
-- Dumping data for table `surgeries`
--

INSERT INTO `surgeries` (`surgery_id`, `patient_id`, `surgery_name`, `surgery_date`, `details`) VALUES
(1, 1, 'Facial', '2026-06-05', 'Fine'),
(2, 3, 'My abs', '7192-01-14', 'qww'),
(3, 1, 'sqqw', '2026-06-26', 'agogoq'),
(4, 1, 'sqqw', '2026-06-26', 'sasq');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allergies`
--
ALTER TABLE `allergies`
  ADD PRIMARY KEY (`allergy_id`),
  ADD KEY `patient_id` (`patient_id`);

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
  ADD PRIMARY KEY (`ros_id`),
  ADD KEY `consultation_id` (`consultation_id`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allergies`
--
ALTER TABLE `allergies`
  MODIFY `allergy_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `consultation`
--
ALTER TABLE `consultation`
  MODIFY `consultation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `family_history`
--
ALTER TABLE `family_history`
  MODIFY `family_history_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gynecologic_history`
--
ALTER TABLE `gynecologic_history`
  MODIFY `gyne_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `hospitalizations`
--
ALTER TABLE `hospitalizations`
  MODIFY `hospitalization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `medical_conditions`
--
ALTER TABLE `medical_conditions`
  MODIFY `condition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `patient_medical_history`
--
ALTER TABLE `patient_medical_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `review_of_systems`
--
ALTER TABLE `review_of_systems`
  MODIFY `ros_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `social_history`
--
ALTER TABLE `social_history`
  MODIFY `social_history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `surgeries`
--
ALTER TABLE `surgeries`
  MODIFY `surgery_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `allergies`
--
ALTER TABLE `allergies`
  ADD CONSTRAINT `allergies_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);

--
-- Constraints for table `family_history`
--
ALTER TABLE `family_history`
  ADD CONSTRAINT `family_history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);

--
-- Constraints for table `gynecologic_history`
--
ALTER TABLE `gynecologic_history`
  ADD CONSTRAINT `gynecologic_history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);

--
-- Constraints for table `hospitalizations`
--
ALTER TABLE `hospitalizations`
  ADD CONSTRAINT `hospitalizations_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);

--
-- Constraints for table `patient_medical_history`
--
ALTER TABLE `patient_medical_history`
  ADD CONSTRAINT `patient_medical_history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`),
  ADD CONSTRAINT `patient_medical_history_ibfk_2` FOREIGN KEY (`condition_id`) REFERENCES `medical_conditions` (`condition_id`);

--
-- Constraints for table `review_of_systems`
--
ALTER TABLE `review_of_systems`
  ADD CONSTRAINT `review_of_systems_ibfk_1` FOREIGN KEY (`consultation_id`) REFERENCES `consultation` (`consultation_id`);

--
-- Constraints for table `social_history`
--
ALTER TABLE `social_history`
  ADD CONSTRAINT `social_history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);

--
-- Constraints for table `surgeries`
--
ALTER TABLE `surgeries`
  ADD CONSTRAINT `surgeries_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
