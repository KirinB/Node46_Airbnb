CREATE TABLE `nguoi_dung`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	pass_word VARCHAR(255) NOT NULL,
	phone VARCHAR(255),
	birth_day VARCHAR(255),
	gender VARCHAR(255),
	role VARCHAR(255),
	`created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

ALTER TABLE nguoi_dung ADD COLUMN avatar VARCHAR(255) NULL;
ALTER TABLE nguoi_dung ADD COLUMN facebook_id VARCHAR(255) UNIQUE;

CREATE TABLE `vi_tri`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ten_vi_tri VARCHAR(255) NOT NULL,
	tinh_thanh VARCHAR(255),
	quoc_gia INT,
	hinh_anh VARCHAR(255),
	`created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE `phong` (
	id INT PRIMARY KEY AUTO_INCREMENT,
	ten_phong VARCHAR(255) NOT NULL,
	khach INT,
	phong_ngu INT,
	giuong INT,
	phong_tam INT,
	mo_ta VARCHAR(255),
	gia_tien INT,
	may_giat BOOLEAN,
	ban_la BOOLEAN,
	tivi BOOLEAN,
	dieu_hoa BOOLEAN,
	wifi BOOLEAN,
	bep BOOLEAN,
	do_xe BOOLEAN,
	ho_boi BOOLEAN,
	ban_ui BOOLEAN,
	hinh_anh VARCHAR(255),
	ma_vi_tri INT,
	FOREIGN KEY (ma_vi_tri) REFERENCES `vi_tri`(id),
	created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE `binh_luan`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ma_phong INT,
	ma_nguoi_binh_luan INT,
	ngay_binh_luan TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	noi_dung VARCHAR(255),
	sao_binh_luan INT,
	FOREIGN KEY (ma_phong) REFERENCES phong(id),
	FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES nguoi_dung(id),
	created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE `dat_phong`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ma_phong INT,
	ngay_den TIMESTAMP,
	ngay_di TIMESTAMP,
	so_luong_khach INT,
	ma_nguoi_dat INT,
	FOREIGN KEY (ma_phong) REFERENCES phong(id),
	FOREIGN KEY (ma_nguoi_dat) REFERENCES nguoi_dung(id),
	created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
