-- Real Estate schema (MySQL)
-- Update database name if needed
CREATE DATABASE IF NOT EXISTS real_estate;
USE real_estate;

CREATE TABLE IF NOT EXISTS agencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  address VARCHAR(255),
  logo_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50),
  reachout_email VARCHAR(255),
  reachout_phone VARCHAR(50),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'client',
  agency_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'RWF',
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postcode VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Rwanda',
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  nrOfRooms INT DEFAULT 0,
  nrOfBathrooms INT DEFAULT 0,
  sqrMeter INT,
  cubicMeter INT,
  nrOfFloors INT,
  locatedOnFloor INT,
  monthlyContribution INT,
  constructionYear INT,
  renovationYear INT,
  heating VARCHAR(255),
  warmWater VARCHAR(255),
  storage VARCHAR(255),
  wifi VARCHAR(255),
  propertyType VARCHAR(100),
  isForSale BOOLEAN NOT NULL DEFAULT 0,
  isForRent BOOLEAN NOT NULL DEFAULT 0,
  parking VARCHAR(255),
  hasGarden BOOLEAN NOT NULL DEFAULT 0,
  hasBalcony BOOLEAN NOT NULL DEFAULT 0,
  hasElevator BOOLEAN NOT NULL DEFAULT 0,
  isFurnished BOOLEAN NOT NULL DEFAULT 0,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  video_url VARCHAR(512) NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  featured BOOLEAN NOT NULL DEFAULT 0,
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS property_extras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  amenity_name VARCHAR(255) NOT NULL,
  amenity_type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_user_likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  UNIQUE KEY uniq_like (user_id, property_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

