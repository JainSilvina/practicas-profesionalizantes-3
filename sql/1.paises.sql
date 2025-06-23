-- Adminer 4.8.1 MySQL 8.0.37 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

USE `actividad_1`;

DELIMITER ;;

DROP PROCEDURE IF EXISTS `crearPais`;;
CREATE PROCEDURE `crearPais`(
	IN _nombre VARCHAR(40),
	IN _capital VARCHAR(40),
	IN _idioma VARCHAR(20),
	IN _superficie DOUBLE,
	IN _poblacion INT
)
BEGIN
	INSERT INTO paises (nombre, capital, idioma, superficie, poblacion)
	VALUES (_nombre, _capital, _idioma, _superficie, _poblacion);
END;;

DROP PROCEDURE IF EXISTS `editarPais`;;
CREATE PROCEDURE `editarPais`(
	IN _id INT,
	IN _nombre VARCHAR(40),
	IN _capital VARCHAR(40),
	IN _idioma VARCHAR(20),
	IN _superficie DOUBLE,
	IN _poblacion INT
)
BEGIN
	UPDATE paises
	SET nombre = _nombre, capital = _capital, idioma = _idioma, superficie = _superficie, poblacion = _poblacion
	WHERE id = _id;
END;;

DROP PROCEDURE IF EXISTS `eliminarPais`;;
CREATE PROCEDURE `eliminarPais`(
	IN _id INT
)
BEGIN
	DELETE FROM paises WHERE id = _id;
END;;

DROP PROCEDURE IF EXISTS `obtenerDatosPorPais`;;
CREATE PROCEDURE `obtenerDatosPorPais`(
	IN _nombre VARCHAR(40)
)
BEGIN
	SELECT * FROM paises WHERE nombre = _nombre;
END;;

DELIMITER ;

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `paises`;
CREATE TABLE `paises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) DEFAULT NULL,
  `capital` varchar(40) DEFAULT NULL,
  `idioma` varchar(20) DEFAULT NULL,
  `superficie` double DEFAULT NULL,
  `poblacion` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `paises` (`id`, `nombre`, `capital`, `idioma`, `superficie`, `poblacion`) VALUES
(1,	'argentina',	'caba',	'español',	11111111,	10101010),
(2,	'chile',	'sintiago',	'chileno',	12345678,	87654321),
(3,	'brasil',	'brasilia',	'portugues',	33333333,	30303030),
(4,	'uruguay',	'montevideo',	'español',	44444444,	40404040),
(6,	'colombia',	'bogota',	'español',	77777777,	70707070),
(7,	'ecuador',	'quito',	'español',	88888888,	80808080),
(8,	'paraguay',	'asuncion',	'español',	99999999,	90909090),
(9,	'peru',	'lima',	'español',	66666666,	60606060);

-- 2025-06-23 00:55:50
