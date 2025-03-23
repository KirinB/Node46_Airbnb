-- -------------------------------------------------------------
-- TablePlus 6.3.2(586)
--
-- https://tableplus.com/
--
-- Database: db_airbnb
-- Generation Time: 2025-03-23 09:07:23.6550
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `binh_luan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_phong` int DEFAULT NULL,
  `ma_nguoi_binh_luan` int DEFAULT NULL,
  `ngay_binh_luan` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `noi_dung` varchar(255) DEFAULT NULL,
  `sao_binh_luan` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ma_phong` (`ma_phong`),
  KEY `ma_nguoi_binh_luan` (`ma_nguoi_binh_luan`),
  CONSTRAINT `binh_luan_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `phong` (`id`),
  CONSTRAINT `binh_luan_ibfk_2` FOREIGN KEY (`ma_nguoi_binh_luan`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `dat_phong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_phong` int DEFAULT NULL,
  `ngay_den` timestamp NULL DEFAULT NULL,
  `ngay_di` timestamp NULL DEFAULT NULL,
  `so_luong_khach` int DEFAULT NULL,
  `ma_nguoi_dat` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ma_phong` (`ma_phong`),
  KEY `ma_nguoi_dat` (`ma_nguoi_dat`),
  CONSTRAINT `dat_phong_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `phong` (`id`),
  CONSTRAINT `dat_phong_ibfk_2` FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `nguoi_dung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pass_word` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `birth_day` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `facebook_id` (`facebook_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `phong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_phong` varchar(255) NOT NULL,
  `khach` int DEFAULT NULL,
  `phong_ngu` int DEFAULT NULL,
  `giuong` int DEFAULT NULL,
  `phong_tam` int DEFAULT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `gia_tien` int DEFAULT NULL,
  `may_giat` tinyint(1) DEFAULT NULL,
  `ban_la` tinyint(1) DEFAULT NULL,
  `tivi` tinyint(1) DEFAULT NULL,
  `dieu_hoa` tinyint(1) DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  `bep` tinyint(1) DEFAULT NULL,
  `do_xe` tinyint(1) DEFAULT NULL,
  `ho_boi` tinyint(1) DEFAULT NULL,
  `ban_ui` tinyint(1) DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `ma_vi_tri` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ma_vi_tri` (`ma_vi_tri`),
  CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`ma_vi_tri`) REFERENCES `vi_tri` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `vi_tri` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_vi_tri` varchar(255) NOT NULL,
  `tinh_thanh` varchar(255) DEFAULT NULL,
  `quoc_gia` int DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `binh_luan` (`id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`, `created_at`, `updated_at`) VALUES
(3, 1, 2, '2024-03-14 12:30:00', 'Bình luận rất tốt!', 5, '2025-03-14 16:19:52', '2025-03-14 16:19:52'),
(5, 1, 2, '2024-03-14 12:30:00', 'Bình luận rất tốt!', 5, '2025-03-14 17:01:46', '2025-03-14 17:01:46'),
(6, 1, 2, '2024-03-14 12:30:00', 'Bình luận rất tốt!11', 5, '2025-03-14 17:01:51', '2025-03-14 17:01:51');

INSERT INTO `dat_phong` (`id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-03-14 12:30:00', '2024-03-14 12:30:00', 3, 1, '2025-03-14 16:45:53', '2025-03-14 16:45:53');

INSERT INTO `nguoi_dung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `created_at`, `updated_at`, `avatar`, `facebook_id`) VALUES
(1, 'Ly Minh Nhan', 'kobkirin@gmail.com', '$2b$10$w/8yG6s1u2slFcVJ9KS63OuNcZ5hUMQzSgyzvcp0xekyAJszClVyS', '0909090909', NULL, NULL, 'ADMIN', '2025-03-13 14:03:13', '2025-03-17 22:51:36', 'https://res.cloudinary.com/dfq7olhxn/image/upload/v1741986284/images/swhldn5t74m3ne8kpkes.jpg', NULL),
(2, 'Minh Nhan', 'minhnhan@gmail.com', '$2b$10$w/8yG6s1u2slFcVJ9KS63OuNcZ5hUMQzSgyzvcp0xekyAJszClVyS', NULL, NULL, NULL, NULL, '2025-03-13 17:16:25', '2025-03-13 17:16:25', NULL, NULL),
(5, 'Minh Nhân', 'lyminhnhan0803@gmail.com', '', NULL, NULL, NULL, NULL, '2025-03-20 03:45:24', '2025-03-20 03:45:24', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3911449489069735&height=50&width=50&ext=1745034324&hash=AbbPPeXt__iBxyyz_ncFRpzZ', '3911449489069735'),
(6, 'Minh Nhan', 'minhnhan23@gmail.com', '$2b$10$G5uxW7lUm.drYNItIOBQH.l6fMnZhzDqp3NRrjkKX2KTbSQT2BBmi', NULL, NULL, NULL, NULL, '2025-03-20 06:57:32', '2025-03-20 06:57:32', NULL, NULL);

INSERT INTO `phong` (`id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `ma_vi_tri`, `created_at`, `updated_at`) VALUES
(1, 'VIP', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'https://res.cloudinary.com/dfq7olhxn/image/upload/v1742393107/images/gwzxajl7qhxwihnwktwe.jpg', 2, '2025-03-14 13:14:33', '2025-03-19 14:05:08');

INSERT INTO `vi_tri` (`id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`, `created_at`, `updated_at`) VALUES
(2, 'Hồ Chí Minh', 'Hồ chí minh', 84, 'https://res.cloudinary.com/dfq7olhxn/image/upload/v1742410953/images/ll15q0kjhg63i9wnw9n1.jpg', '2025-03-14 10:59:40', '2025-03-19 19:02:33');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;