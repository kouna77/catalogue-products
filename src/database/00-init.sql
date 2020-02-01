CREATE DATABASE catalogue_db charset utf8 collate utf8_general_ci;
create user 'bachir'@'localhost' identified by 'bachir';
grant all privileges on catalogue_db.* to "bachir"@"localhost";
