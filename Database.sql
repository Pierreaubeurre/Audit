DROP DATABASE IF EXISTS BD_AUDIT;
CREATE DATABASE BD_AUDIT CHARACTER SET utf8;
USE BD_AUDIT;

CREATE USER IF NOT EXISTS 'Audit'@'localhost' IDENTIFIED BY 'Karen';
GRANT ALL PRIVILEGES ON *.* TO 'Audit'@'localhost';


CREATE TABLE REGION
(
NOM_REGION                VARCHAR (200) NOT NULL,
PRIMARY KEY (NOM_REGION)
);

CREATE TABLE LYCEE
(
RNE                         VARCHAR (20) NOT NULL,
NOM                         VARCHAR (150) NOT NULL,
RUE                         VARCHAR (150) NULL,
CODE_POSTAL                 VARCHAR (5) NULL,
VILLE                       VARCHAR (100) NULL,
TEL                         VARCHAR (100) NULL,
MAIL                        VARCHAR (100) NULL,

NOM_REGION                  VARCHAR (200) NOT NULL,

PRIMARY KEY (RNE),
FOREIGN KEY (NOM_REGION) REFERENCES REGION (NOM_REGION)
);

CREATE TABLE AUDIT
(
DATE 			    VARCHAR (100) NULL,
INTITULE		    VARCHAR (200) NULL,

RNE			    VARCHAR (20) NOT NULL,
ID_AUDIT		    VARCHAR (200) NOT NULL,

PRIMARY KEY (ID_AUDIT),
FOREIGN KEY (RNE) REFERENCES LYCEE (RNE)
);

CREATE TABLE SALLE
(
NOM                         VARCHAR (100) NOT NULL,
BATIMENT                    VARCHAR (100) NOT NULL,
ETAGE                       VARCHAR (100) NOT NULL,
ACCES                       VARCHAR (100) NOT NULL,
CLIM                        VARCHAR (100) NOT NULL,
SUPERFICIE                  REAL NULL, 
RADIATEUR                   VARCHAR (100) NULL,

ID_AUDIT                    VARCHAR (200) NOT NULL,
ID_SALLE                    VARCHAR (200) NOT NULL,

PRIMARY KEY (ID_SALLE),
FOREIGN KEY (ID_AUDIT) REFERENCES AUDIT (ID_AUDIT)
);

CREATE TABLE BAIE
(
NOM                         VARCHAR (150) NULL,
PHOTO                       VARCHAR (100) NULL,
TAILLE                      INTEGER (2) NULL,
NOMBRE_U                    INTEGER NULL,
C_MANAGEMENT                VARCHAR (100) NOT NULL,
FERMETURE                   BOOLEAN NOT NULL,
ETIQUETAGE_B                BOOLEAN NOT NULL,
POSITION                    VARCHAR (100) NOT NULL,
SOURCE_A                    VARCHAR (100) NULL,
DOUBLE_A_PLUSIEURS_RESEAUX  VARCHAR (100) NULL,
PRECIS                      VARCHAR (150) NULL,
ETIQUETAGE_C                VARCHAR (100) NOT NULL,
CHEMIN_CABLE                BOOLEAN NULL,

ID_SALLE                    VARCHAR (200) NOT NULL,
ID_BAIE                     VARCHAR (200) NOT NULL,

PRIMARY KEY (ID_BAIE),
FOREIGN KEY (ID_SALLE) REFERENCES SALLE (ID_SALLE)
);

CREATE TABLE FIBRE
(
TYPE                        VARCHAR (20) NOT NULL,
BRINS_TOTAL                 INTEGER (2) NOT NULL,
BRINS_UTILISE               INTEGER (2) NOT NULL,
CONNECTEUR                  VARCHAR (20) NOT NULL,
EXTREMITES                  VARCHAR (150) NULL,
LONGUEUR                    DECIMAL (5) NULL,
E_BANDEAU_FIBRES            VARCHAR (10) NOT NULL,
E_JARRETIERE                VARCHAR (10) NOT NULL,
ETAT                        VARCHAR (20) NULL,

ID_FIBRE                    VARCHAR (200) NOT NULL,
ID_SALLE                    VARCHAR (200) NOT NULL,
ID_BAIE                     VARCHAR (200) NULL,

PRIMARY KEY (ID_FIBRE),
FOREIGN KEY (ID_SALLE) REFERENCES SALLE (ID_SALLE),
FOREIGN KEY (ID_BAIE) REFERENCES BAIE (ID_BAIE)
);

CREATE TABLE ROCADE
(
LIEU_TERMINAISON            VARCHAR (150) NOT NULL,
LONGUEUR                    DECIMAL (5) NULL,
ETAT                        VARCHAR (20) NULL,
CATEGORIE                   VARCHAR (10) NULL,
BLINDAGE                    VARCHAR (10) NULL,
ETIQUETAGE                  BOOLEAN NOT NULL,

ID_ROCADE                   VARCHAR (200) NOT NULL,
ID_SALLE                    VARCHAR (200) NOT NULL,
ID_BAIE                     VARCHAR (200) NULL,

PRIMARY KEY (ID_ROCADE),
FOREIGN KEY (ID_SALLE) REFERENCES SALLE (ID_SALLE),
FOREIGN KEY (ID_BAIE) REFERENCES BAIE (ID_BAIE)
);


CREATE TABLE PRISE_RJ45 
(
NOM_BANDEAU                 VARCHAR (200) NOT NULL,
NOMBRE_P_BRANCHE            INTEGER (2) NOT NULL,
NOMBRE_P_BANDEAU            INTEGER (2) NOT NULL,
CATEGORIE                   VARCHAR (10) NULL,
BLINDAGE                    VARCHAR (10) NULL,
ETAT                        VARCHAR (20) NULL,
FIBRE_DEPARD_ARRIVE         VARCHAR (20) NULL,

ID_PRISE                    VARCHAR (200) NOT NULL,
ID_SALLE                    VARCHAR (200) NOT NULL,
ID_BAIE                     VARCHAR (100) NULL,

PRIMARY KEY (ID_PRISE),
FOREIGN KEY (ID_SALLE) REFERENCES SALLE(ID_SALLE),
FOREIGN KEY (ID_BAIE) REFERENCES BAIE (ID_ROCADE)
);

CREATE TABLE ONDULEUR   
(
MARQUE                      VARCHAR (150) NOT NULL,
MODELE                      VARCHAR (200) NOT NULL,
CARTE                       BOOLEAN NOT NULL,
ONDULEUR_P                  BOOLEAN NOT NULL,
IP                          VARCHAR (15) NULL,
PUISSANCE                   INTEGER (2) NULL,
DUREE_B                     DECIMAL (4) NULL,

ID_ONDULATEUR               VARCHAR (100) NOT NULL,
ID_SALLE                    VARCHAR (200) NOT NULL,
ID_BAIE                     VARCHAR (200) NULL,

PRIMARY KEY (ID_ONDULATEUR),
FOREIGN KEY (ID_SALLE) REFERENCES SALLE (ID_SALLE),
FOREIGN KEY (ID_BAIE) REFERENCES BAIE (ID_BAIE)
);

CREATE TABLE SERVEUR
(
NOM                         VARCHAR (200) NOT NULL,
PHOTO                       VARCHAR (200) NULL,
ETIQUETAGE                  VARCHAR (200) NULL,
MARQUE                      VARCHAR (200) NOT NULL,
MODELE                      VARCHAR (50) NOT NULL,
RAM                         BOOLEAN NOT NULL,
STOCKAGE_DISPO              VARCHAR (200) NOT NULL,
OS                          VARCHAR (200) NOT NULL,
ANNEE_SERVICE               VARCHAR (200) NULL,

ID_SERVEUR                  VARCHAR (100) NOT NULL,
ID_SALLE                    VARCHAR (200) NOT NULL,
ID_BAIE                     VARCHAR (200) NULL,

PRIMARY KEY (ID_SERVEUR),
FOREIGN KEY (ID_SALLE) REFERENCES SALLE (ID_SALLE),
FOREIGN KEY (ID_BAIE) REFERENCES BAIE (ID_BAIE)
);

CREATE TABLE SWITCH
(

NOM_SWITCH                  VARCHAR (200) NOT NULL,
IP_1                        VARCHAR (15) NOT NULL,
IP_2                        VARCHAR (15) NULL,
IP_3                        VARCHAR (15) NULL,
IP_4                        VARCHAR (15) NULL,
IP_5                        VARCHAR (15) NULL,
IP_6                        VARCHAR (15) NULL,
IP_7                        VARCHAR (15) NULL,
IP_8                        VARCHAR (15) NULL,
IP_9                        VARCHAR (15) NULL,
IP_10                       VARCHAR (15) NULL,
MASQUE                      VARCHAR (32) NULL,
VLAN                        INTEGER (4) NOT NULL,
NOM_UTILISATEUR             VARCHAR (200) NOT NULL,
MDP                         VARCHAR (200) NOT NULL,
MODELE                      VARCHAR (200) NOT NULL,
NUMERO_SERIE                VARCHAR (200) NULL,
FIRMWARE                    VARCHAR (200) NULL,
SAVE_CONFIG                 VARCHAR (200) NOT NULL, 
CONFIG_D_A                  BOOLEAN NOT NULL,
SWITCH_STACK                BOOLEAN NOT NULL,
SWITCH_PILE                 INTEGER (1) NOT NULL,
TYPE_STACK                  VARCHAR (6) NOT NULL,
DAC                         BOOLEAN NOT NULL,
STACK_10G                   BOOLEAN NOT NULL,
SWITCH_MISSING              BOOLEAN NOT NULL,
PRIO_HAUTE                  BOOLEAN NOT NULL,

TYPE_SWITCH                 VARCHAR (20) NOT NULL, 

SNMP                        VARCHAR (200) NOT NULL,
FICH_ERREUR                 VARCHAR (200) NULL,
FICH_MAC                    VARCHAR (200) NULL,    
FICH_ARP                    VARCHAR (200) NULL,
FICH_LLDP                   VARCHAR (200) NULL,
FICH_VLAN                   VARCHAR (200) NULL,
FICH_INTERFACE              VARCHAR (200) NULL,
VENTILATEURS                BOOLEAN NOT NULL,
BUDGET_POE                  DECIMAL (5) NOT NULL,
SFP_RECOMMANDATION          VARCHAR (20) NULL,
SFP_N_CONFORME              VARCHAR (200) NOT NULL,
INTERFACE_IMPORTANTE        VARCHAR (20) NOT NULL,
PRECISION_INTERFACE_N_N     VARCHAR (200) NOT NULL,
AGREGATION_ROCADE           VARCHAR (30) NOT NULL,
PRECISION_ROCADE_S_A        VARCHAR (200) NOT NULL,
AGREGATION_STAT_DYNA        VARCHAR (30) NOT NULL,
LISTE_AGREGATION            VARCHAR (200) NULL,
I_A_2_LIENS                 VARCHAR (10) NOT NULL,
LIEN_PAS_ACTIF              VARCHAR (200) NULL,
SPANNING_TREE               BOOLEAN NULL,
MODE_SPANNING_TREE          VARCHAR (5) NOT NULL,
PRIORITE_G_SWITCH           VARCHAR (5) NOT NULL,
PORTS_TERMINAUX             VARCHAR (25) NOT NULL,
PRECISION_PORTS             VARCHAR (200) NOT NULL,
DATE_SPANNING_TREE          VARCHAR (10) NOT NULL,
RAISON_SPANNING_TREE        VARCHAR (200) NOT NULL,
SWITCH_HEURE                BOOLEAN NOT NULL,
S_MAJ_HEURE                 VARCHAR (200) NOT NULL,
DATE_NTP                    VARCHAR (10) NOT NULL,
TEMPS_SSH                   INTEGER (200) NOT NULL,
TEMPS_CONSOLE               INTEGER (200) NOT NULL,
PROBLEME_SWITCH             VARCHAR (200) NOT NULL,

ID_SALLE                    VARCHAR (200) NOT NULL,
ID_BAIE                     VARCHAR (200) NULL,

FOREIGN KEY (ID_SALLE) REFERENCES SALLE (ID_SALLE),
FOREIGN KEY (ID_BAIE) REFERENCES BAIE (ID_BAIE)

);

--Tableaux reliés à serveur

CREATE TABLE HYPER_V
(
DOMAINE                     BOOLEAN NOT NULL,
SUPERVISION                 BOOLEAN NOT NULL,
COMPTE                      VARCHAR (150) NULL,
CHEMIN_VM                   VARCHAR (200) NOT NULL,
ISL                         BOOLEAN NOT NULL,
APEXONE                     BOOLEAN NOT NULL,
CONTROLE_DISTANCE           BOOLEAN NOT NULL,
D_PARE_FEU                  BOOLEAN NOT NULL,
OS                          VARCHAR (150) NULL,
CARTE_RESEAU                BOOLEAN NOT NULL,
RESEAU                      VARCHAR (15) NOT NULL,
INTERFACE_RESEAU            INTEGER (2) NULL,
NOMBRE_VM                   INTEGER (2) NOT NULL,
NOM_VM                      VARCHAR (150) NOT NULL,

ID_SERVEUR                  VARCHAR (100) NOT NULL,
ID_HYPER_V                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_HYPER_V),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)
);

CREATE TABLE AD_DNS_DHCP
(
NOM_DOMAINE                 VARCHAR (150) NOT NULL,
COMPTE_AD                   VARCHAR (20) NULL,
METHODE                     VARCHAR (50) NOT NULL,
CHEMIN                      VARCHAR (200) NULL,
APEX                        VARCHAR (150) NOT NULL,
DNS                         VARCHAR (15) NULL,
WI_FI                       BOOLEAN NOT NULL,
WPAD_DAT                    BOOLEAN NOT NULL,
KMS                         BOOLEAN NOT NULL,
METHODE_IP                  VARCHAR (30) NOT NULL,
ARBORESCENCE                BOOLEAN NOT NULL,
GPO_RGE                     BOOLEAN NOT NULL,
POLICYDEFINITION            BOOLEAN NOT NULL,
NETLOGON                    VARCHAR (20) NOT NULL,

ID_AD_DNS                   VARCHAR (100) NOT NULL,
ID_SERVEUR                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_AD_DNS),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)
);

CREATE TABLE DAT
(
ACL_ORG                     BOOLEAN NOT NULL,
VERSION_ACL                 VARCHAR (150) NULL,
STOCKAGE                    INTEGER NULL,
CHEMIN_TRAVAIL              VARCHAR (200) NULL,
CHIMN_LOG                   VARCHAR (200) NULL,
GESTION_QUOTA               BOOLEAN NULL,
NETTOYAGE                   BOOLEAN NULL,
ZAKLOGON                    BOOLEAN NULL,
DROIT_ACCES                 BOOLEAN NULL,

ID_DAT                      VARCHAR (100) NOT NULL,
ID_SERVEUR                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_DAT),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)
);

CREATE TABLE SERVEUR_IMPRESSION
(
NOM                         VARCHAR (150) NULL,
NOMBRE_P_BANDEAU            INTEGER (2) NULL,
PILOTES                     VARCHAR (150) NULL,
METHODE_DEPLOIEMENT         VARCHAR (150) NULL,
PATCH                       VARCHAR (150) NULL,

ID_IMPRESSION               VARCHAR (100) NOT NULL,
ID_SERVEUR                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_IMPRESSION),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)
);

CREATE TABLE VM_SECU
(
ESPACE_WSUS                 INTEGER (4) NOT NULL,
CHEMIN_ACCES                VARCHAR (200) NOT NULL,
NETTOYAGE_WSUS              BOOLEAN NOT NULL,
LIMITE                      BOOLEAN NOT NULL,
GPO                         BOOLEAN NULL,
PC_APEXONE                  BOOLEAN NULL,
PC_HORS_DOMAINE             BOOLEAN NOT NULL,
FICHIER_MSI                 BOOLEAN NOT NULL,
CONSOLE                     BOOLEAN NOT NULL,
SAN_AUTO                    BOOLEAN NOT NULL,
HEURE_SAN                   VARCHAR (10) NULL,

ID_VM_SECU                  VARCHAR (100) NOT NULL,
ID_SERVEUR                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_VM_SECU),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)

);

CREATE TABLE TICKETING
(
NOM_SOLUTION                VARCHAR (150) NOT NULL,
VERSION_SOLUTION            VARCHAR (150) NULL,
OUVERT                      BOOLEAN NULL,
LDAP                        BOOLEAN NOT NULL,
COMPTE                      CHAR NULL,
INVENTORY                   BOOLEAN NULL,
SMTP                        BOOLEAN NULL,
ACCES_SERVICE               VARCHAR (20) NULL,

ID_TICKETING                VARCHAR (100) NOT NULL,
ID_SERVEUR                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_TICKETING),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)
);

CREATE TABLE PXE
(
SOLUTION                    VARCHAR (200) NULL,
GIGA_ALLOUE                 INTEGER (4) NULL,
NOMBRE_IMAGE                INTEGER (2) NULL,
OPTION_DHCP                 BOOLEAN NULL,
SERVICE                     VARCHAR (10) NULL,

ID_PXE                      VARCHAR (100) NOT NULL,
ID_SERVEUR                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_PXE),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)
);

CREATE TABLE NAS
(
NOMBRE_BAIE                 INTEGER (2) NOT NULL,
BAIE_UTILISE                INTEGER (2) NOT NULL,
RAID                        VARCHAR (150) NULL,
ESPACE_DISQUE               VARCHAR (5) NOT NULL,
CORBEILLE                   BOOLEAN NOT NULL,
REMONTE_SAUVEGARDE          BOOLEAN NOT NULL,
MISE_A_JOUR                 BOOLEAN NOT NULL,
SAVE_VEEAM                  BOOLEAN NOT NULL,
PRECIS                      VARCHAR (150) NULL,
CARTE_RESEAU                BOOLEAN NULL,
MULTIPLEXE_CARTE            BOOLEAN NULL,

PORT                        INTEGER (1) NULL,
PORT_MANAGEMENT             BOOLEAN NULL,

ID_NAS                      VARCHAR (100) NOT NULL,
ID_SERVEUR                  VARCHAR (100) NOT NULL,

PRIMARY KEY (ID_NAS),
FOREIGN KEY (ID_SERVEUR) REFERENCES SERVEUR (ID_SERVEUR)
);

CREATE TABLE AUTRE
(
TYPE_SERVICE                VARCHAR (150) NULL,
DESCRI                      VARCHAR (150) NULL
);


INSERT INTO REGION
    VALUES 
    ("Champagne Ardenne"),
    ("Lorraine");


INSERT INTO LYCEE 
    VALUES
    ("0080006N","CHANZY","13 rue Delvincourt","08000","CHARLEVILLE MEZIERE","03 24 33 21 65","ce.0080006N@ac-reims.fr","Champagne Ardenne"),
    ("0080028M","CHARLES DE GONZAGUE","84 rue du Bois Fortant","08003","CHARLEVILLE MEZIERES","03 24 33 21 65","ce.0080006N@ac-reims.fr","Champagne Ardenne"),
    ("0080863V","CHARLEVILLE MEZIERES - Agricole du Balcon des Ardennes","27 rue du Muguet","08090","SAINT LAURENT","03 24 57 49 26","epl.charleville@educagri.fr","Champagne Ardenne"),
    ("0080804F","DE RETHEL (agricole)","route de Nouvion","08300","RETHEL","03.24.39.60.00","contact@cense08.fr","Champagne Ardenne"),
    ("0550891V","EUGENE FREYSSINET","6 avenue du Président Kennedy","55107","VERDUN","03 29 84 41 65","ce.0550891V@ac-reims.fr","Lorraine"),
    ("0080008R","FRANCOIS BAZIN","145 avenue Charles de Gaulle","08013","CHARLEVILLE MEZIERES","03 24 56 81 56","ce.0080008R@ac-reims.fr","Champagne Ardenne"),
    ("0081047V","HOTELIER BAZEILLES","parc du château de Montvillers","08207","SEDAN","03 24 27 43 00","ce.0081047V@ac-reims.fr","Champagne Ardenne"),
    ("0080047H","JEAN BAPTISTE CLEMENT - 1","11 rue Jean Jaurès","08200","SEDAN","03 24 27 41 16","ce.0080047H@ac-reims.fr","Champagne Ardenne"),
    ("0080047H-2","JEAN BAPTISTE CLEMENT - 2","61 rue Tambach Dietharz","08440","VIVIER","03 24 27 41 16","ce.0080047H@ac-reims.fr","Champagne Ardenne"),
    ("0080040A","JEAN MOULIN","996 avenue de la Cité Scolaire","08500","REVIN","03 24 42 65 00","ce.0080040A@ac-reims.fr","Champagne Ardenne"),
    ("0080048J","LE CHÂTEAU","1 place du Château","08208","SEDAN","03 24 29 41 22","ce.0080048J@ac-reims.fr","Champagne Ardenne"),
    ("0080027L","MONGE","2 avenue de Saint-Julien","08000","CHARLEVILLE MEZIERES","03 24 52 69 69","ce.0080027L@ac-reims.fr","Champagne Ardenne"),
    ("0080039Z","PAUL VERLAINE","19 rue Normandie Niemen","08305","RETHEL","03 24 39 50 30","ce.0080039Z@ac-reims.fr","Champagne Ardenne"),
    ("0080045F","PIERRE BAYLE","rue Jean Rogissart","08200","SEDAN","03 24 27 39 95","ce.0080045F@ac-reims.fr","Champagne Ardenne"),
    ("0080007P","SEVIGNE","14 rue Madame de Sévigné","08013","CHARLEVILLE MEZIERES","03 24 59 83 00","ce.0080007P@ac-reims.fr","Champagne Ardenne"),
    ("0080010T","SIMONE VEIL","rue Jean de la Fontaine","08000","CHARLEVILLE MEZIERES","03 24 33 03 10","ce.0080010T@ac-reims.fr","Champagne Ardenne"),
    ("0080053P","THOMAS MASARYK","35 rue Bournizet","08400","VOUZIERS","03 24 71 84 66","ce.0080053P@ac-reims.fr","Champagne Ardenne"),
    ("0080018B","VAUBAN","15 rue André Bousy","08600","GIVET","03 24 42 09 42","ce.0080018B@ac-reims.fr","Champagne Ardenne"),
    ("0550026E","LP - ALAIN FOURNIER","12 avenue du Président Kennedy","55107","VERDUN","03 29 84 41 69","ce.0550026E@ac-reims.fr","Lorraine"),
    ("0550072E","LPO - ALFRED KASTLER","1 rue de Munnerstadt","55700","STENAY","03 29 80 32 54","ce.0550072E@ac-reims.fr","Lorraine"),
    ("0550025D-2","LPO - JEAN-AUGUSTE MARGUERITTE - Vauban","place Vauban","55107","VERDUN","03 29 86 14 28","ce.0550025D@ac-reims.fr","Lorraine"),
    ("0550025D","LPO - JEAN-AUGUSTE MARGUERITTE - Galland","13 place Galland","55107","VERDUN","03 29 86 14 28","ce.0550025D@ac-reims.fr","Lorraine");
