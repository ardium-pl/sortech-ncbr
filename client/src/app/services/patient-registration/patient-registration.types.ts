type BasicPacientInfo = {
    name: string;
    age: number;
    pesel: string;
    gender: 'male' | 'female' | 'apache attack helicopter';
}

type ApplicationMetaData = {
    date: Date;
    entryTime: Date; // Kiedy pacjent wszedł na oddział
    aplicationTime: Date; //Czas pierwszego spotkania z medykiem segmentującym pacjenta 
    medicalAssistTime: Date; // Kiedy pacjenta przyjął lekarz/ratownik
    dischargeTime: Date; // kiedy pacjent opuścił oddział 
    dischargeCause: 'pacient recovered' | 'pacient passed to another hospital'|'pacient is dead';
}

type MedicalSegmentationCard = {
    respiratoryFailure: boolean; // Niewydolność oddechowa
    circulatoryFailure: boolean; // Niewydolność krążenia
    consciousnessDisorders: boolean; // Zaburzenia świadomości
    injuryLocation: {
      front: SpecificInjuryLocation;
      back: SpecificInjuryLocation;
    };
    radiationHazards: boolean;
    edema: boolean; // Odma (taka chroba płuc)
  };
  
  type SpecificInjuryLocation = {
    head: InjuryDetails | false;
    neck: InjuryDetails| false;
    leftShoulder: InjuryDetails| false;
    rightShoulder: InjuryDetails| false;
    leftArm: InjuryDetails | false;
    rightArm: InjuryDetails | false;
    leftHand: InjuryDetails | false;
    rightHand: InjuryDetails | false;
    chest: InjuryDetails | false;
    abdomen: InjuryDetails| false;
    leftLeg: InjuryDetails| false;
    rightLeg: InjuryDetails| false;
    leftFoot: InjuryDetails| false;
    rightFoot: InjuryDetails| false;
  };
  
  type InjuryDetails = {
    openFracture: boolean; // Złamanie otwarte
    closedFracture: boolean; // Złamanie zamknięte
    contusion: boolean; // Zwichnięcie
    hearing: boolean; // Słuchowe
    wound: boolean; // Rana
    bleedingFromWound: boolean; // Krwotok z rany
    crush: boolean; // Zmiażdżenie
    amputation: boolean; // Amputacja
    neuropathicPain: boolean; // Ból neuropatyczny
    burn: boolean; // Oparzenia
    burnDegrees: {
      firstDegree: number; // % oparzenia I stopnia
      secondDegree: number; // % oparzenia II stopnia
      thirdDegree: number; // % oparzenia III stopnia
    };
  };