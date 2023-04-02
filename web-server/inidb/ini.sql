
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema appvirt
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema appvirt
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `appvirt` DEFAULT CHARACTER SET utf8 ;
USE `appvirt` ;

-- -----------------------------------------------------
-- Table `appvirt`.`group`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `appvirt`.`group` ;

CREATE TABLE IF NOT EXISTS `appvirt`.`group` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `appvirt`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `appvirt`.`user` ;

CREATE TABLE IF NOT EXISTS `appvirt`.`user` (
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(32) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `group_id` INT NULL,
  PRIMARY KEY (`username`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `group_id_idx` (`group_id` ASC) VISIBLE,
  CONSTRAINT `group_id`
    FOREIGN KEY (`group_id`)
    REFERENCES `appvirt`.`group` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `appvirt`.`app`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `appvirt`.`app` ;

CREATE TABLE IF NOT EXISTS `appvirt`.`app` (
  `docker_image` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `logo` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`docker_image`),
  UNIQUE INDEX `docker-image_UNIQUE` (`docker_image` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `appvirt`.`app_has_group`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `appvirt`.`app_has_group` ;

CREATE TABLE IF NOT EXISTS `appvirt`.`app_has_group` (
  `app_docker_image` VARCHAR(255) NOT NULL,
  `id_group` INT NOT NULL,
  PRIMARY KEY (`app_docker_image`, `id_group`),
  INDEX `fk_app_has_group_group1_idx` (`id_group` ASC) VISIBLE,
  INDEX `fk_app_has_group_app1_idx` (`app_docker_image` ASC) VISIBLE,
  CONSTRAINT `app_id`
    FOREIGN KEY (`app_docker_image`)
    REFERENCES `appvirt`.`app` (`docker_image`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_group`
    FOREIGN KEY (`id_group`)
    REFERENCES `appvirt`.`group` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
