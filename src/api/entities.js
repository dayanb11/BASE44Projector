import { base44, unauthenticatedBase44 } from './base44Client';


export const Program = base44.entities.Program;

export const ProgramTask = base44.entities.ProgramTask;

export const Employee = unauthenticatedBase44.entities.Employee;

export const ActivityPool = base44.entities.ActivityPool;

export const EngagementType = base44.entities.EngagementType;

export const Division = base44.entities.Division;

export const Department = base44.entities.Department;

export const Domain = base44.entities.Domain;

export const ProcurementTeam = base44.entities.ProcurementTeam;



// auth sdk:
export const User = unauthenticatedBase44.auth;