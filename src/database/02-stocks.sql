USE catalogue_db;

create table stocks (
    id int auto_increment,
    date date,
    quantite_entree float,
    quantite_sortie float,
    nom varchar (60) null ,
    prenom varchar (30) null,
    cni varchar(30) null,
    telephone varchar (30) null,
    constraint pk_stocks PRIMARY KEY (id)
);
