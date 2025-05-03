DROP TABLE Store;
DROP TABLE WorkAs;
DROP TABLE Shoot;
DROP TABLE Keep;
DROP TABLE Maintains;
DROP TABLE EarnsSalary;
DROP TABLE ActiveSoldier;
DROP TABLE DeadSoldier;
DROP TABLE RetiredSoldier;
DROP TABLE IsIn;
DROP TABLE Storage;
DROP TABLE Barracks;
DROP TABLE Drive;
DROP TABLE Ammo;
DROP TABLE MountsOn;
DROP TABLE Use;
DROP TABLE Manage;
DROP TABLE Weapon;
DROP TABLE Vehicle;
DROP TABLE ContainsBuildingAndFields;
DROP TABLE HasCombatRecord;
DROP TABLE GetBudget;
DROP TABLE Base;
DROP TABLE Soldier;
DROP TABLE Duty;

CREATE TABLE Duty (
DutyID INTEGER NOT NULL,
Title VARCHAR(20) UNIQUE NOT NULL,
DutyDescription VARCHAR(100) NOT NULL,
PRIMARY KEY (DutyID)
);

CREATE TABLE Soldier ( 
SoldierID INTEGER, 
Rank VARCHAR(20) NOT NULL, 
Sex CHAR(6) NOT NULL, 
ServiceYear INTEGER NOT NULL, 
Age INTEGER NOT NULL, 
SoldierName VARCHAR(20) NOT NULL, 
PRIMARY KEY (SoldierID) 
);

CREATE TABLE Base ( 
BaseLocation VARCHAR(50), 
BaseAreaSize INTEGER NOT NULL, 
PRIMARY KEY (BaseLocation) 
);

CREATE TABLE GetBudget ( 
BudgetDocumentNumber INTEGER NOT NULL, 
BudgetDate DATE NOT NULL, BudgetAmount FLOAT(2) NOT NULL, 
BudgetDescription VARCHAR(100) NOT NULL, 
BaseLocation VARCHAR(50) NOT NULL, 
PRIMARY KEY (BudgetDocumentNumber),
CONSTRAINT fk_BaseLocation
FOREIGN KEY (BaseLocation) 
REFERENCES Base(BaseLocation) 
ON DELETE CASCADE
);

CREATE TABLE HasCombatRecord ( 
CombatRecordDocumentNumber INTEGER NOT NULL, 
CombatRecordDate DATE NOT NULL, 
Award VARCHAR(20), 
Penalty VARCHAR(20), 
CombatRecordDescription VARCHAR(100) NOT NULL, 
SoldierID INTEGER NOT NULL, 
PRIMARY KEY (CombatRecordDocumentNumber),
CONSTRAINT fk_ID
FOREIGN KEY (SoldierID)
REFERENCES Soldier(SoldierID) ON DELETE CASCADE
);

CREATE TABLE ContainsBuildingAndFields ( 
BuildingFieldsAddress VARCHAR(50) NOT NULL, 
BuildingFieldsName VARCHAR(20) NOT NULL, 
Function VARCHAR(20) NOT NULL, 
BuildingFieldsAreaSize INTEGER NOT NULL, 
BaseLocation VARCHAR(50) NOT NULL,
PRIMARY KEY (BuildingFieldsAddress),
CONSTRAINT fk_BaseLocation2
FOREIGN KEY (BaseLocation) 
REFERENCES Base(BaseLocation) 
ON DELETE CASCADE
);

CREATE TABLE Vehicle ( 
LicencePlate CHAR(10) NOT NULL, 
NumberOfSeats INTEGER NOT NULL, 
VehicleType VARCHAR(20) NOT NULL, 
VehicleCapacity INTEGER NOT NULL,
PRIMARY KEY (LicencePlate)
);

CREATE TABLE Weapon ( 
SerialNumber CHAR(10) NOT NULL, 
WeaponCaliber CHAR(10) NOT NULL, 
EffectiveRange INTEGER NOT NULL,
PRIMARY KEY (SerialNumber)
);

CREATE TABLE Manage ( 
HighRankSoldierID INTEGER NOT NULL, 
LowRankSoldierID INTEGER NOT NULL, 
PRIMARY KEY (HighRankSoldierID, LowRankSoldierID),
CONSTRAINT fk_ID3
FOREIGN KEY (HighRankSoldierID) 
REFERENCES Soldier(SoldierID) 
ON DELETE CASCADE,
CONSTRAINT fk_ID4
FOREIGN KEY (LowRankSoldierID) 
REFERENCES Soldier(SoldierID) ON DELETE CASCADE
);

CREATE TABLE Use ( 
SoldierID INTEGER, 
SerialNumber CHAR(10), 
PRIMARY KEY (SoldierID),
CONSTRAINT fk_ID5
FOREIGN KEY (SoldierID) 
REFERENCES Soldier (SoldierID)
ON DELETE CASCADE,
CONSTRAINT fk_serial
FOREIGN KEY (SerialNumber) 
REFERENCES Weapon(SerialNumber)
ON DELETE CASCADE
);

CREATE TABLE MountsOn ( 
LicencePlate CHAR(10), 
SerialNumber CHAR(10), 
PRIMARY KEY (LicencePlate, SerialNumber),
CONSTRAINT fk_serial2
FOREIGN KEY (SerialNumber)
REFERENCES Weapon(SerialNumber) ON DELETE CASCADE,
CONSTRAINT fk_licence
FOREIGN KEY (LicencePlate)
REFERENCES Vehicle(LicencePlate) ON DELETE CASCADE
);

CREATE TABLE Ammo ( 
AmmoCaliber CHAR(10), 
ProjectileType VARCHAR(20), 
Corrosivity INT,  
Quantity INT,
PRIMARY KEY (AmmoCaliber, ProjectileType),
CHECK (Quantity>0),
CHECK (Corrosivity>=0 AND Corrosivity<=1)
);

CREATE TABLE Drive ( 
SoldierID INTEGER, 
LicencePlate CHAR(10), 
PRIMARY KEY (SoldierID, LicencePlate),
CONSTRAINT fk_ID6
FOREIGN KEY (SoldierID) 
REFERENCES Soldier(SoldierID) 
ON DELETE CASCADE,
CONSTRAINT fk_licence2
FOREIGN KEY (LicencePlate ) 
REFERENCES  Vehicle(LicencePlate)
ON DELETE CASCADE
);

CREATE TABLE Barracks ( 
BuildingAndFieldsAddress VARCHAR(50), 
BarracksCapacity INTEGER NOT NULL,
PRIMARY KEY (BuildingAndFieldsAddress),
CONSTRAINT fk_buildingAdd
FOREIGN KEY (BuildingAndFieldsAddress)
REFERENCES ContainsBuildingAndFields (BuildingFieldsAddress) 
ON DELETE CASCADE
);

CREATE TABLE Storage ( 
BuildingAndFieldsAddress VARCHAR(50), 
StorageCapacity VARCHAR(20) NOT NULL, 
PRIMARY KEY (BuildingAndFieldsAddress),
CONSTRAINT fk_buildingAdd2
FOREIGN KEY (BuildingAndFieldsAddress)
REFERENCES ContainsBuildingAndFields (BuildingFieldsAddress)
ON DELETE CASCADE
);

CREATE TABLE IsIn ( 
SoldierID INTEGER, 
BaseLocation VARCHAR(50), 
TimeStarted DATE NOT NULL, 
PRIMARY KEY (SoldierID, BaseLocation),
CONSTRAINT fk_ID8
FOREIGN KEY (SoldierID)
REFERENCES Soldier(SoldierID)
ON DELETE CASCADE, 
CONSTRAINT fk_BaseLocation3
FOREIGN KEY (BaseLocation)
REFERENCES Base(BaseLocation)
ON DELETE CASCADE
);

CREATE TABLE RetiredSoldier ( 
SoldierID INTEGER, 
LeftDate DATE NOT NULL, 
RetiredSoldierAddress VARCHAR(50) NOT NULL, 
PRIMARY KEY (SoldierID),
CONSTRAINT fk_ID9
FOREIGN KEY (SoldierID)
REFERENCES Soldier (SoldierID) 
ON DELETE CASCADE
);

CREATE TABLE DeadSoldier ( 
SoldierID INTEGER, 
LeftDate DATE NOT NULL, 
DeathReason VARCHAR(20) NOT NULL, 
PRIMARY KEY (SoldierID),
CONSTRAINT fk_ID10
FOREIGN KEY (SoldierID)
REFERENCES Soldier (SoldierID)
ON DELETE CASCADE
);

CREATE TABLE ActiveSoldier ( 
SoldierID INTEGER, 
PermissionLevel VARCHAR(20) NOT NULL, 
PRIMARY KEY (SoldierID),
CONSTRAINT fk_ID11
FOREIGN KEY (SoldierID) 
REFERENCES Soldier (SoldierID) 
ON DELETE CASCADE
);

CREATE TABLE EarnsSalary ( 
SoldierID INTEGER NOT NULL, 
SalaryDate DATE NOT NULL, 
SalaryAmount FLOAT(2) NOT NULL, 
Tax FLOAT(2) NOT NULL,
PRIMARY KEY (SoldierID, SalaryDate),
CONSTRAINT fk_ID2
FOREIGN KEY (SoldierID) 
REFERENCES ActiveSoldier(SoldierID) 
ON DELETE CASCADE
);

CREATE TABLE Maintains ( 
SoldierID INTEGER, 
BuildingAndFieldsAddress VARCHAR(50),
PRIMARY KEY (SoldierID, BuildingAndFieldsAddress),
CONSTRAINT fk_ID7
FOREIGN KEY (SoldierID)
REFERENCES ActiveSoldier (SoldierID) 
ON DELETE CASCADE, 
CONSTRAINT fk_buildingAdd3
FOREIGN KEY (BuildingAndFieldsAddress)
REFERENCES ContainsBuildingAndFields (BuildingFieldsAddress)
ON DELETE CASCADE
);

CREATE TABLE Keep ( 
StorageAddress VARCHAR(50), 
AmmoCaliber CHAR(10), 
ProjectileType VARCHAR(20) NOT NULL, 
PRIMARY KEY (StorageAddress, AmmoCaliber, ProjectileType),
CONSTRAINT fk_buildingAdd4
FOREIGN KEY (StorageAddress)
REFERENCES Storage(BuildingAndFieldsAddress)
ON DELETE CASCADE,
CONSTRAINT fk_caliber
FOREIGN KEY (AmmoCaliber,ProjectileType)
REFERENCES Ammo(AmmoCaliber,ProjectileType)
ON DELETE CASCADE
);

CREATE TABLE Shoot ( 
SerialNumber CHAR(10),
AmmoCaliber CHAR(10),
ProjectileType VARCHAR(20),
PRIMARY KEY (SerialNumber, AmmoCaliber, ProjectileType),
CONSTRAINT fk_serial3
FOREIGN KEY (SerialNumber)
REFERENCES Weapon (SerialNumber)
ON DELETE CASCADE,
CONSTRAINT fk_caliber2
FOREIGN KEY (AmmoCaliber,ProjectileType)
REFERENCES Ammo(AmmoCaliber,ProjectileType)
ON DELETE CASCADE
);

CREATE TABLE WorkAs ( 
DutyID INTEGER,
SoldierID INTEGER,
PRIMARY KEY (DutyID, SoldierID),
CONSTRAINT fk_duty
FOREIGN KEY (DutyID)
REFERENCES Duty (DutyID)
ON DELETE CASCADE,
CONSTRAINT fk_id12
FOREIGN KEY (SoldierID)
REFERENCES Soldier (SoldierID)
ON DELETE CASCADE
);

CREATE TABLE Store ( 
StorageAddress VARCHAR(50), 
SerialNumber CHAR(10), 
PRIMARY KEY (StorageAddress, SerialNumber),
CONSTRAINT fk_serial4
FOREIGN KEY (SerialNumber) 
REFERENCES Weapon(SerialNumber)
ON DELETE CASCADE,
CONSTRAINT fk_buildingAdd5
FOREIGN KEY (StorageAddress) REFERENCES
Storage (BuildingAndFieldsAddress)
ON DELETE CASCADE
);

INSERT INTO Duty (DutyID, Title, DutyDescription) VALUES (1, 'Guard', 'Responsible for guarding the base.');
INSERT INTO Duty (DutyID, Title, DutyDescription) VALUES (2, 'Patrol', 'Patrol assigned areas for security checks.');
INSERT INTO Duty (DutyID, Title, DutyDescription) VALUES (3, 'Cook', 'Prepare daily meals for personnel.');
INSERT INTO Duty (DutyID, Title, DutyDescription) VALUES (4, 'Mechanic', 'Maintain and repair vehicles.');
INSERT INTO Duty (DutyID, Title, DutyDescription) VALUES (5, 'Driver', 'Operate vehicles for transport duties.');
INSERT INTO Duty (DutyID, Title, DutyDescription) VALUES (6, 'Medic', 'Provide medical assistance and first aid.');
INSERT INTO Duty (DutyID, Title, DutyDescription) VALUES (7, 'Technician', 'Maintain communication and radar systems.');

INSERT INTO Soldier (SoldierID, Rank, Sex, ServiceYear, Age, SoldierName) VALUES (101, 'Private', 'Male', 1, 21, 'John');
INSERT INTO Soldier (SoldierID, Rank, Sex, ServiceYear, Age, SoldierName) VALUES (102, 'Sergeant', 'Female', 3, 24, 'Alice');
INSERT INTO Soldier (SoldierID, Rank, Sex, ServiceYear, Age, SoldierName) VALUES (103, 'Sergeant', 'Male', 5, 29, 'Bob');
INSERT INTO Soldier (SoldierID, Rank, Sex, ServiceYear, Age, SoldierName) VALUES (104, 'Lieutenant', 'Female', 7, 32, 'Diana');
INSERT INTO Soldier (SoldierID, Rank, Sex, ServiceYear, Age, SoldierName) VALUES (105, 'Captain', 'Male', 10, 40, 'Charlie');
INSERT INTO Soldier (SoldierID, Rank, Sex, ServiceYear, Age, SoldierName) VALUES (106, 'Major', 'Female', 12, 45, 'Samantha');
INSERT INTO Soldier (SoldierID, Rank, Sex, ServiceYear, Age, SoldierName) VALUES (107, 'Colonel', 'Male', 18, 50, 'Robert');

INSERT INTO WorkAs (DutyID, SoldierID) VALUES (1, 101);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (2, 101);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (3, 101);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (4, 101);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (5, 101);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (6, 101);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (7, 101);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (2, 102);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (3, 103);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (4, 104);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (5, 105);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (6, 106);
INSERT INTO WorkAs (DutyID, SoldierID) VALUES (7, 107);

INSERT INTO Manage (HighRankSoldierID, LowRankSoldierID) VALUES (104, 101);
INSERT INTO Manage (HighRankSoldierID, LowRankSoldierID) VALUES (104, 102);
INSERT INTO Manage (HighRankSoldierID, LowRankSoldierID) VALUES (105, 103);
INSERT INTO Manage (HighRankSoldierID, LowRankSoldierID) VALUES (106, 104);
INSERT INTO Manage (HighRankSoldierID, LowRankSoldierID) VALUES (107, 105);
INSERT INTO Manage (HighRankSoldierID, LowRankSoldierID) VALUES (107, 106);
INSERT INTO Manage (HighRankSoldierID, LowRankSoldierID) VALUES (105, 107);

INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES ('North Base', 500);
INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES ('South Base', 600);
INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES ('East Base', 450);  
INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES ('West Base', 550);
INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES ('Central Base', 700);
INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES ('Training Base', 400);
INSERT INTO Base (BaseLocation, BaseAreaSize) VALUES ('Medical Base', 650);

INSERT INTO IsIn (SoldierID, BaseLocation, TimeStarted) VALUES (101, 'North Base', TO_DATE('2020-01-01','YYYY-MM-DD'));
INSERT INTO IsIn (SoldierID, BaseLocation, TimeStarted) VALUES (102, 'South Base', TO_DATE('2020-02-01','YYYY-MM-DD'));
INSERT INTO IsIn (SoldierID, BaseLocation, TimeStarted) VALUES (103, 'East Base', TO_DATE('2020-03-01','YYYY-MM-DD')); 
INSERT INTO IsIn (SoldierID, BaseLocation, TimeStarted) VALUES (104, 'West Base', TO_DATE('2020-04-01','YYYY-MM-DD'));
INSERT INTO IsIn (SoldierID, BaseLocation, TimeStarted) VALUES (105, 'Central Base', TO_DATE('2020-05-01','YYYY-MM-DD'));
INSERT INTO IsIn (SoldierID, BaseLocation, TimeStarted) VALUES (106, 'Training Base', TO_DATE('2020-06-01','YYYY-MM-DD'));
INSERT INTO IsIn (SoldierID, BaseLocation, TimeStarted) VALUES (107, 'Medical Base', TO_DATE('2020-07-01','YYYY-MM-DD'));

INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation) VALUES (201, TO_DATE('2024-01-15','YYYY-MM-DD'), 1000.00, 'Maintenance Funds', 'North Base');
INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation) VALUES (202, TO_DATE('2024-02-20','YYYY-MM-DD'), 2500.50, 'New Equipment', 'South Base');
INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation) VALUES (203, TO_DATE('2024-03-15','YYYY-MM-DD'), 500.00, 'Emergency Repair', 'East Base');
INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation) VALUES (204, TO_DATE('2024-04-10','YYYY-MM-DD'), 3000.25, 'Supply Purchase', 'West Base');
INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation) VALUES (205, TO_DATE('2024-05-22','YYYY-MM-DD'), 4200.75, 'Transportation Costs', 'Central Base');
INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation) VALUES (206, TO_DATE('2024-06-18','YYYY-MM-DD'), 5000.00, 'Medical Supplies', 'Medical Base');
INSERT INTO GetBudget (BudgetDocumentNumber, BudgetDate, BudgetAmount, BudgetDescription, BaseLocation) VALUES (207, TO_DATE('2024-07-30','YYYY-MM-DD'), 3500.50, 'Training Programs', 'Training Base');

INSERT INTO HasCombatRecord (CombatRecordDocumentNumber, CombatRecordDate, Award, Penalty, CombatRecordDescription, SoldierID) VALUES (301, TO_DATE('2023-11-10','YYYY-MM-DD'), 'Medal of Honor', NULL, 'Operation Shield success', 101);
INSERT INTO HasCombatRecord (CombatRecordDocumentNumber, CombatRecordDate, Award, Penalty, CombatRecordDescription, SoldierID) VALUES (302, TO_DATE('2024-01-05','YYYY-MM-DD'), 'Purple Heart', 'Reprimand', 'Injury during Operation Storm', 102);
INSERT INTO HasCombatRecord (CombatRecordDocumentNumber, CombatRecordDate, Award, Penalty, CombatRecordDescription, SoldierID) VALUES (303, TO_DATE('2024-02-11','YYYY-MM-DD'), NULL, 'Fine', 'Minor misconduct in base', 103);
INSERT INTO HasCombatRecord (CombatRecordDocumentNumber, CombatRecordDate, Award, Penalty, CombatRecordDescription, SoldierID) VALUES (304, TO_DATE('2024-03-19','YYYY-MM-DD'), 'Commendation', NULL, 'Operation Eagle support', 104);
INSERT INTO HasCombatRecord (CombatRecordDocumentNumber, CombatRecordDate, Award, Penalty, CombatRecordDescription, SoldierID) VALUES (305, TO_DATE('2024-04-25','YYYY-MM-DD'), 'DistinguishService', NULL, 'Excellent leadership in crisis', 105);
INSERT INTO HasCombatRecord (CombatRecordDocumentNumber, CombatRecordDate, Award, Penalty, CombatRecordDescription, SoldierID) VALUES (306, TO_DATE('2024-05-15','YYYY-MM-DD'), NULL, 'Warning', 'Unauthorized leave', 106);
INSERT INTO HasCombatRecord (CombatRecordDocumentNumber, CombatRecordDate, Award, Penalty, CombatRecordDescription, SoldierID) VALUES (307, TO_DATE('2024-06-12','YYYY-MM-DD'), 'Special Recognition', NULL, 'Successful counterterrorism mission', 107);

INSERT INTO ContainsBuildingAndFields (BuildingFieldsAddress, BuildingFieldsName, Function, BuildingFieldsAreaSize, BaseLocation) VALUES ('UBC-1', 'Storage Bldg', 'Storage', 100, 'North Base');
INSERT INTO ContainsBuildingAndFields (BuildingFieldsAddress, BuildingFieldsName, Function, BuildingFieldsAreaSize, BaseLocation) VALUES ('UBC-2', 'Barracks A', 'Barracks', 200, 'South Base');
INSERT INTO ContainsBuildingAndFields (BuildingFieldsAddress, BuildingFieldsName, Function, BuildingFieldsAreaSize, BaseLocation) VALUES ('UBC-3', 'Garage X', 'Garage', 150, 'East Base');
INSERT INTO ContainsBuildingAndFields (BuildingFieldsAddress, BuildingFieldsName, Function, BuildingFieldsAreaSize, BaseLocation) VALUES ('UBC-4', 'HQ Office', 'Office', 80, 'West Base');
INSERT INTO ContainsBuildingAndFields (BuildingFieldsAddress, BuildingFieldsName, Function, BuildingFieldsAreaSize, BaseLocation) VALUES ('UBC-5', 'Training Field', 'Training', 300, 'Central Base');
INSERT INTO ContainsBuildingAndFields (BuildingFieldsAddress, BuildingFieldsName, Function, BuildingFieldsAreaSize, BaseLocation) VALUES ('UBC-6', 'Medical Facility', 'Hospital', 250, 'Medical Base');
INSERT INTO ContainsBuildingAndFields (BuildingFieldsAddress, BuildingFieldsName, Function, BuildingFieldsAreaSize, BaseLocation) VALUES ('UBC-7', 'Shooting Range', 'Training', 180, 'Training Base');

INSERT INTO RetiredSoldier (SoldierID, LeftDate, RetiredSoldierAddress) VALUES (107, TO_DATE('2023-12-31','YYYY-MM-DD'), 'Retired Address A');

INSERT INTO DeadSoldier (SoldierID, LeftDate, DeathReason) VALUES (103, TO_DATE('2023-07-15','YYYY-MM-DD'), 'Enemy Action');

INSERT INTO ActiveSoldier (SoldierID, PermissionLevel) VALUES (101, 'Full'); 
INSERT INTO ActiveSoldier (SoldierID, PermissionLevel) VALUES (102, 'Limited'); 
INSERT INTO ActiveSoldier (SoldierID, PermissionLevel) VALUES (104, 'Full');
INSERT INTO ActiveSoldier (SoldierID, PermissionLevel) VALUES (105, 'Limited'); 
INSERT INTO ActiveSoldier (SoldierID, PermissionLevel) VALUES (106, 'Limited');

INSERT INTO Maintains (SoldierID, BuildingAndFieldsAddress) VALUES (101, 'UBC-1');
INSERT INTO Maintains (SoldierID, BuildingAndFieldsAddress) VALUES (102, 'UBC-2');
INSERT INTO Maintains (SoldierID, BuildingAndFieldsAddress) VALUES (104, 'UBC-4');
INSERT INTO Maintains (SoldierID, BuildingAndFieldsAddress) VALUES (105, 'UBC-5');
INSERT INTO Maintains (SoldierID, BuildingAndFieldsAddress) VALUES (106, 'UBC-6');

INSERT INTO EarnsSalary (SoldierID, SalaryDate, SalaryAmount, Tax) VALUES (101, TO_DATE('2024-01-15','YYYY-MM-DD'), 1000.00, 150.00);

INSERT INTO Storage(BuildingAndFieldsAddress, StorageCapacity) VALUES ('UBC-1', 'Large');

INSERT INTO Barracks (BuildingAndFieldsAddress, BarracksCapacity) VALUES ('UBC-2', 100);

INSERT INTO Vehicle (LicencePlate, NumberOfSeats, VehicleType, VehicleCapacity) VALUES ('VL0001', 4, 'Jeep', 4);
INSERT INTO Vehicle (LicencePlate, NumberOfSeats, VehicleType, VehicleCapacity) VALUES ('VL0002', 2, 'Motorcycle', 2);
INSERT INTO Vehicle (LicencePlate, NumberOfSeats, VehicleType, VehicleCapacity) VALUES ('VL0003', 10, 'Van', 10);
INSERT INTO Vehicle (LicencePlate, NumberOfSeats, VehicleType, VehicleCapacity) VALUES ('VL0004', 20, 'Bus', 30);
INSERT INTO Vehicle (LicencePlate, NumberOfSeats, VehicleType, VehicleCapacity) VALUES ('VL0005', 4, 'Car', 4);
INSERT INTO Vehicle (LicencePlate, NumberOfSeats, VehicleType, VehicleCapacity) VALUES ('VL0006', 6, 'Truck', 50);
INSERT INTO Vehicle (LicencePlate, NumberOfSeats, VehicleType, VehicleCapacity) VALUES ('VL0007', 8, 'SUV', 8);

INSERT INTO Drive (SoldierID, LicencePlate) VALUES (101, 'VL0001');
INSERT INTO Drive (SoldierID, LicencePlate) VALUES (102, 'VL0002');
INSERT INTO Drive (SoldierID, LicencePlate) VALUES (103, 'VL0003');
INSERT INTO Drive (SoldierID, LicencePlate) VALUES (102, 'VL0004');
INSERT INTO Drive (SoldierID, LicencePlate) VALUES (101, 'VL0005');
INSERT INTO Drive (SoldierID, LicencePlate) VALUES (102, 'VL0006');
INSERT INTO Drive (SoldierID, LicencePlate) VALUES (105, 'VL0007');

INSERT INTO Weapon (SerialNumber, WeaponCaliber, EffectiveRange) VALUES ('WPN0001', '5.56*45mm', 500);
INSERT INTO Weapon (SerialNumber, WeaponCaliber, EffectiveRange) VALUES ('WPN0002', '7.62*51mm', 800);
INSERT INTO Weapon (SerialNumber, WeaponCaliber, EffectiveRange) VALUES ('WPN0003', '9*19mm', 200);
INSERT INTO Weapon (SerialNumber, WeaponCaliber, EffectiveRange) VALUES ('WPN0004', '50BMG', 1500);
INSERT INTO Weapon (SerialNumber, WeaponCaliber, EffectiveRange) VALUES ('WPN0005', '12ga', 100);
INSERT INTO Weapon (SerialNumber, WeaponCaliber, EffectiveRange) VALUES ('WPN0006', '40mm', 1000);
INSERT INTO Weapon (SerialNumber, WeaponCaliber, EffectiveRange) VALUES ('WPN0007', '20mm', 600);

INSERT INTO Use (SoldierID, SerialNumber) VALUES (101, 'WPN0001');
INSERT INTO Use (SoldierID, SerialNumber) VALUES (102, 'WPN0002');
INSERT INTO Use (SoldierID, SerialNumber) VALUES (104, 'WPN0003');
INSERT INTO Use (SoldierID, SerialNumber) VALUES (105, 'WPN0004');
INSERT INTO Use (SoldierID, SerialNumber) VALUES (106, 'WPN0005');

INSERT INTO Store (StorageAddress, SerialNumber) VALUES ('UBC-1', 'WPN0001');
INSERT INTO Store (StorageAddress, SerialNumber) VALUES ('UBC-1', 'WPN0002');
INSERT INTO Store (StorageAddress, SerialNumber) VALUES ('UBC-1', 'WPN0003');
INSERT INTO Store (StorageAddress, SerialNumber) VALUES ('UBC-1', 'WPN0004');
INSERT INTO Store (StorageAddress, SerialNumber) VALUES ('UBC-1', 'WPN0005');
INSERT INTO Store (StorageAddress, SerialNumber) VALUES ('UBC-1', 'WPN0006');
INSERT INTO Store (StorageAddress, SerialNumber) VALUES ('UBC-1', 'WPN0007');

INSERT INTO MountsOn (LicencePlate, SerialNumber) VALUES ('VL0001', 'WPN0007');

INSERT INTO Ammo (AmmoCaliber, ProjectileType, Corrosivity, Quantity) VALUES ('5.56*45mm', 'FMJ', 0,300000);
INSERT INTO Ammo (AmmoCaliber, ProjectileType, Corrosivity, Quantity) VALUES('7.62*51mm', 'HP', 1,100000);

INSERT INTO Keep (StorageAddress, AmmoCaliber, ProjectileType) VALUES ('UBC-1', '5.56*45mm', 'FMJ');
INSERT INTO Keep (StorageAddress, AmmoCaliber, ProjectileType) VALUES ('UBC-1', '7.62*51mm', 'HP');

INSERT INTO Shoot (SerialNumber, AmmoCaliber, ProjectileType) VALUES ('WPN0001', '5.56*45mm', 'FMJ');
INSERT INTO Shoot (SerialNumber, AmmoCaliber, ProjectileType) VALUES ('WPN0002', '7.62*51mm', 'HP');

