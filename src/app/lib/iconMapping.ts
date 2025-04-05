import {
    BsHeartFill, BsHeart, BsHeartPulse, BsActivity, BsLungs, BsThermometerHalf,
    BsDroplet, BsDropletFill, BsDropletHalf, BsCapsule,
    BsWatch, BsClock, BsClockHistory, BsCalendar, BsCalendarCheck,
    BsClipboard, BsClipboard2, BsClipboard2Check, BsClipboard2Pulse,
    BsPerson, BsPersonCircle, BsHospital, BsEye, BsEyeFill,
    BsBandaid, BsBandaidFill, BsShield, BsShieldPlus
} from "react-icons/bs";

import {
    FaHeartbeat, FaLungs, FaWeight, FaUserNurse,
    FaStethoscope, FaSyringe, FaHeadSideMask, FaPills, FaHospital,
    FaHospitalUser, FaBrain, FaBone, FaXRay, FaTemperatureHigh,
    FaTemperatureLow, FaVirus, FaViruses, FaBed, FaProcedures,
    FaWheelchair, FaWalking, FaRunning, FaHeartBroken, FaTooth, FaAllergies,
    FaSwimmer, FaBiking
} from "react-icons/fa";

import {
    FaUserDoctor,
    FaWeightScale
} from "react-icons/fa6";

import {
    MdOutlineLocalHospital, MdLocalPharmacy, MdBloodtype, MdOutlineBloodtype,
    MdMonitorHeart, MdOutlineMonitorHeart, MdHealthAndSafety,
    MdRestaurant, MdWaterDrop, MdMonitorWeight, MdSportsHandball,
    MdSportsGymnastics, MdDirectionsRun, MdDirectionsWalk, MdAccessibilityNew,
    MdFitnessCenter, MdSick, MdBedroomBaby, MdWheelchairPickup, MdNoDrinks,
    MdNoFood, MdMedication, MdMedicationLiquid
} from "react-icons/md";

import {SiOxygen} from "react-icons/si";

import {
    GiHeartBeats, GiLungs, GiWeightScale, GiHeartOrgan, GiStomach,
    GiBrain, GiKidneys, GiLiver, GiMuscleUp,
    GiMedicalThermometer, GiPill, GiMedicines, GiScubaTanks,
    GiHealthNormal, GiHealthIncrease, GiHealthDecrease, GiEyedropper,
    GiMeditation, GiNightSleep, GiBed, GiBlood, GiDna1,
    GiSkeleton, GiSkeletonInside, GiWalk
} from "react-icons/gi";

import {
    AiOutlineHeart, AiFillHeart, AiOutlineEye, AiFillEye,
    AiOutlineAlert, AiFillAlert, AiOutlineRise, AiOutlineFall
} from "react-icons/ai";

import {
    IoMdPulse, IoMdFitness, IoMdNutrition, IoMdWater, IoMdMedical,
    IoMdMedkit, IoMdThermometer, IoMdTrendingUp, IoMdTrendingDown
} from "react-icons/io";

import {IoFemale, IoMale, IoSpeedometerOutline} from "react-icons/io5";

import {IconType} from "react-icons";

// Create the icon mapping with focused medical, vitals, and health monitoring icons
const iconMapping: Record<string, IconType> = {
    // Heart & Cardiovascular
    HeartFill: BsHeartFill,
    Heart: BsHeart,
    HeartPulse: BsHeartPulse,
    Heartbeat: FaHeartbeat,
    HeartBeats: GiHeartBeats,
    HeartOrgan: GiHeartOrgan,
    OutlineHeart: AiOutlineHeart,
    FillHeart: AiFillHeart,
    MonitorHeart: MdMonitorHeart,
    OutlineMonitorHeart: MdOutlineMonitorHeart,
    HeartBroken: FaHeartBroken,

    // Blood
    Droplet: BsDroplet,
    DropletFill: BsDropletFill,
    DropletHalf: BsDropletHalf,
    BloodType: MdBloodtype,
    OutlineBloodType: MdOutlineBloodtype,
    BloodPressure: IoSpeedometerOutline,
    Blood: GiBlood,
    WaterDrop: MdWaterDrop,

    // Lungs & Respiratory
    Lungs: BsLungs,
    LungsFa: FaLungs,
    LungsGi: GiLungs,
    Oxygen: SiOxygen,
    OxygenTank: GiScubaTanks,
    HeadSideMask: FaHeadSideMask,

    // Temperature
    ThermometerHalf: BsThermometerHalf,
    MedicalThermometer: GiMedicalThermometer,
    TemperatureHigh: FaTemperatureHigh,
    TemperatureLow: FaTemperatureLow,
    Thermometer: IoMdThermometer,

    // Activity & Vitals Monitoring
    Activity: BsActivity,
    Pulse: IoMdPulse,
    TrendingUp: IoMdTrendingUp,
    TrendingDown: IoMdTrendingDown,
    Rise: AiOutlineRise,
    Fall: AiOutlineFall,

    // Time & Tracking
    Watch: BsWatch,
    Clock: BsClock,
    ClockHistory: BsClockHistory,
    Calendar: BsCalendar,
    CalendarCheck: BsCalendarCheck,

    // Records & Charts
    Clipboard: BsClipboard,
    Clipboard2: BsClipboard2,
    Clipboard2Check: BsClipboard2Check,
    Clipboard2Pulse: BsClipboard2Pulse,

    // Weight & Body
    Weight: FaWeight,
    WeightScale: FaWeightScale,
    WeightScaleGi: GiWeightScale,
    MonitorWeight: MdMonitorWeight,

    // Medication
    Capsule: BsCapsule,
    Pills: FaPills,
    Pill: GiPill,
    Medicines: GiMedicines,
    Medication: MdMedication,
    MedicationLiquid: MdMedicationLiquid,
    Syringe: FaSyringe,

    // Medical Professionals & Facilities
    Person: BsPerson,
    PersonCircle: BsPersonCircle,
    UserDoctor: FaUserDoctor,
    UserNurse: FaUserNurse,
    Hospital: BsHospital,
    HospitalFa: FaHospital,
    HospitalUser: FaHospitalUser,
    OutlineLocalHospital: MdOutlineLocalHospital,
    LocalPharmacy: MdLocalPharmacy,

    // Medical Tools & Procedures
    Stethoscope: FaStethoscope,
    Bandaid: BsBandaid,
    BandaidFill: BsBandaidFill,
    XRay: FaXRay,
    Eyedropper: GiEyedropper,

    // Organs & Body Parts
    Brain: FaBrain,
    BrainGi: GiBrain,
    Stomach: GiStomach,
    Kidney: GiKidneys,
    Liver: GiLiver,
    Bone: FaBone,
    Tooth: FaTooth,
    Eye: BsEye,
    EyeFill: BsEyeFill,
    OutlineEye: AiOutlineEye,
    FillEye: AiFillEye,

    // Fitness & Activity
    Fitness: IoMdFitness,
    FitnessCenter: MdFitnessCenter,
    MuscleUp: GiMuscleUp,
    SportsHandball: MdSportsHandball,
    SportsGymnastics: MdSportsGymnastics,
    DirectionsRun: MdDirectionsRun,
    Walking: FaWalking,
    Running: FaRunning,
    Swimmer: FaSwimmer,
    Biking: FaBiking,
    Walk: GiWalk,

    // Rest & Recovery
    Meditation: GiMeditation,
    NightSleep: GiNightSleep,
    Bed: GiBed,
    BedFa: FaBed,
    Procedures: FaProcedures,
    BedroomBaby: MdBedroomBaby,

    // Alerts & Status
    OutlineAlert: AiOutlineAlert,
    FillAlert: AiFillAlert,
    Shield: BsShield,
    ShieldPlus: BsShieldPlus,
    HealthAndSafety: MdHealthAndSafety,

    // General Health Status
    HealthNormal: GiHealthNormal,
    HealthIncrease: GiHealthIncrease,
    HealthDecrease: GiHealthDecrease,

    // Nutrition & Diet
    Nutrition: IoMdNutrition,
    Water: IoMdWater,
    Restaurant: MdRestaurant,
    NoDrinks: MdNoDrinks,
    NoFood: MdNoFood,

    // Accessibility & Mobility
    Wheelchair: FaWheelchair,
    WheelchairPickup: MdWheelchairPickup,
    AccessibilityNew: MdAccessibilityNew,
    DirectionsWalk: MdDirectionsWalk,

    // Miscellaneous Medical
    Virus: FaVirus,
    Viruses: FaViruses,
    Allergies: FaAllergies,
    Dna: GiDna1,
    Skeleton: GiSkeleton,
    SkeletonInside: GiSkeletonInside,
    Sick: MdSick,
    Medical: IoMdMedical,
    Medkit: IoMdMedkit,

    //Gender
    Female: IoFemale,
    Male: IoMale,
};

type IconName = keyof typeof iconMapping;

export default iconMapping;
export type {IconName};