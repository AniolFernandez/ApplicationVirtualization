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
-- Table `appvirt`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `appvirt`.`role` ;

CREATE TABLE IF NOT EXISTS `appvirt`.`role` (
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
  `password` VARCHAR(128) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `role_id` INT NULL,
  PRIMARY KEY (`username`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `role_id_idx` (`role_id` ASC) VISIBLE,
  INDEX `create_time_idx` (`create_time` DESC) VISIBLE,
  CONSTRAINT `group_id`
    FOREIGN KEY (`role_id`)
    REFERENCES `appvirt`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `appvirt`.`app`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `appvirt`.`app` ;

CREATE TABLE IF NOT EXISTS `appvirt`.`app` (
  `docker_image` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `logo` TEXT NULL DEFAULT NULL,
  `availableUnauth` BINARY NOT NULL,
  `availableAnyAuth` BINARY NOT NULL,
  PRIMARY KEY (`docker_image`),
  UNIQUE INDEX `docker-image_UNIQUE` (`docker_image` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE);


-- -----------------------------------------------------
-- Table `appvirt`.`role_has_app`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `appvirt`.`role_has_app` ;

CREATE TABLE IF NOT EXISTS `appvirt`.`role_has_app` (
  `role_id` INT NOT NULL,
  `app_docker_image` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`role_id`, `app_docker_image`),
  INDEX `fk_role_has_app_app1_idx` (`app_docker_image` ASC) VISIBLE,
  INDEX `fk_role_has_app_role1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_role_has_app_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `appvirt`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_role_has_app_app1`
    FOREIGN KEY (`app_docker_image`)
    REFERENCES `appvirt`.`app` (`docker_image`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;