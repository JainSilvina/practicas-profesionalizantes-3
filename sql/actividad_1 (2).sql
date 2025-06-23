-- Adminer 4.8.1 MySQL 8.0.37 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `actividad_1` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `actividad_1`;

DELIMITER ;;

DROP PROCEDURE IF EXISTS `crearCiudad`;;
CREATE PROCEDURE `crearCiudad`(
	IN _nombre VARCHAR(40),
	IN _poblacion INT,
	IN _superficie DOUBLE,
	IN _codigo_postal VARCHAR(10),
	IN _es_costera BOOLEAN,
	IN _pais_id INT
)
BEGIN
	INSERT INTO ciudades (nombre, poblacion, superficie, codigo_postal, es_costera, pais_id)
	VALUES (_nombre, _poblacion, _superficie, _codigo_postal, _es_costera, _pais_id);
END;;

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

DROP PROCEDURE IF EXISTS `editarCiudad`;;
CREATE PROCEDURE `editarCiudad`(
	IN _id INT,
	IN _nombre VARCHAR(40),
	IN _poblacion INT,
	IN _superficie DOUBLE,
	IN _codigo_postal VARCHAR(10),
	IN _es_costera BOOLEAN,
	IN _pais_id INT
)
BEGIN
	UPDATE ciudades
	SET nombre = _nombre,
		poblacion = _poblacion,
		superficie = _superficie,
		codigo_postal = _codigo_postal,
		es_costera = _es_costera,
		pais_id = _pais_id
	WHERE id = _id;
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

DROP PROCEDURE IF EXISTS `eliminarCiudad`;;
CREATE PROCEDURE `eliminarCiudad`(
	IN _id INT
)
BEGIN
	DELETE FROM ciudades WHERE id = _id;
END;;

DROP PROCEDURE IF EXISTS `eliminarPais`;;
CREATE PROCEDURE `eliminarPais`(
	IN _id INT
)
BEGIN
	DELETE FROM paises WHERE id = _id;
END;;

DROP PROCEDURE IF EXISTS `mostrarPaisCiudadMasPoblada`;;
CREATE PROCEDURE `mostrarPaisCiudadMasPoblada`()
BEGIN
	SELECT p.nombre AS nombre_pais, c.nombre AS nombre_ciudad, c.poblacion
	FROM ciudades c
	JOIN paises p ON c.pais_id = p.id
	ORDER BY c.poblacion DESC
	LIMIT 1;
END;;

DROP PROCEDURE IF EXISTS `obtenerCiudadPorId`;;
CREATE PROCEDURE `obtenerCiudadPorId`(
	IN _id INT
)
BEGIN
	SELECT c.*, p.nombre AS nombre_pais
	FROM ciudades c
	JOIN paises p ON c.pais_id = p.id
	WHERE c.id = _id;
END;;

DROP PROCEDURE IF EXISTS `obtenerDatosPorPais`;;
CREATE PROCEDURE `obtenerDatosPorPais`(
	IN _nombre VARCHAR(40)
)
BEGIN
	SELECT * FROM paises WHERE nombre = _nombre;
END;;

DROP PROCEDURE IF EXISTS `obtenerPaisCiudadMayorDensidad`;;
CREATE PROCEDURE `obtenerPaisCiudadMayorDensidad`()
BEGIN
	SELECT p.nombre AS nombre_pais, c.nombre AS nombre_ciudad,
		   c.poblacion / c.superficie AS densidad_poblacion
	FROM ciudades c
	JOIN paises p ON c.pais_id = p.id
	WHERE c.superficie > 0 -- Evitar división por cero
	ORDER BY densidad_poblacion DESC
	LIMIT 1;
END;;

DROP PROCEDURE IF EXISTS `obtenerPaisesCiudadesCosterasMillon`;;
CREATE PROCEDURE `obtenerPaisesCiudadesCosterasMillon`()
BEGIN
	SELECT DISTINCT p.nombre AS nombre_pais
	FROM paises p
	JOIN ciudades c ON p.id = c.pais_id
	WHERE c.es_costera = TRUE AND c.poblacion > 1000000;
END;;

DELIMITER ;

CREATE TABLE `ciudades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) DEFAULT NULL,
  `poblacion` int DEFAULT NULL,
  `superficie` double DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `es_costera` tinyint(1) DEFAULT NULL,
  `pais_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pais_id` (`pais_id`),
  CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ciudades` (`id`, `nombre`, `poblacion`, `superficie`, `codigo_postal`, `es_costera`, `pais_id`) VALUES
(1,	'Buenos Aires',	15000000,	203,	'C1000',	1,	1),
(2,	'Valdivia',	170000,	420,	'5090000',	1,	2),
(3,	'Mar del Plata',	700000,	1459,	'B7600',	1,	1),
(4,	'Santiago',	6000000,	641,	'8320000',	0,	2),
(5,	'Valparaíso',	300000,	400,	'2340000',	1,	2),
(6,	'São Paulo',	22000000,	1521,	'01000-000',	0,	3),
(7,	'Río de Janeiro',	6700000,	1200,	'20000-000',	1,	3),
(8,	'Montevideo',	1300000,	530,	'11000',	1,	4),
(9,	'La Paz',	800000,	470,	'1000',	0,	5),
(10,	'Santa Cruz de la Sierra',	2000000,	537,	'3000',	0,	5),
(11,	'Bogotá',	7800000,	1775,	'110111',	0,	6),
(12,	'Cartagena',	1000000,	572,	'130001',	1,	6),
(13,	'Barranquilla',	1200000,	166,	'080001',	1,	6),
(15,	'Quito',	2000000,	372,	'170101',	0,	7),
(16,	'Asunción',	500000,	117,	'1001',	0,	8),
(17,	'Rosario',	1300000,	178,	'S2000',	0,	1);

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
(1,	'argentina',	'caba',	'español',	2780400,	46000000),
(2,	'chile',	'santiago',	'español',	756102,	19000000),
(3,	'brasil',	'brasilia',	'portugues',	8515767,	215000000),
(4,	'uruguay',	'montevideo',	'español',	176215,	3500000),
(5,	'bolivia',	'sucre',	'español',	1098581,	12000000),
(6,	'colombia',	'bogota',	'español',	1141748,	51000000),
(7,	'ecuador',	'quito',	'español',	283561,	18000000),
(8,	'paraguay',	'asuncion',	'español',	406752,	6800000),
(9,	'peru',	'lima',	'español',	1285216,	33000000);


