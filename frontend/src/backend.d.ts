import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    id: string;
    taluk: string;
    officeName: string;
    district: string;
    village: string;
}
export interface DocumentPreparer {
    id: string;
    name: string;
    office: string;
    mobile: string;
}
export interface DeedDraft {
    id: string;
    createdAt: bigint;
    formData: string;
    updatedAt: bigint;
    deedType: DeedType;
}
export interface Party {
    id: string;
    relationship: string;
    name: string;
    aadhaar: string;
    address: string;
    mobile: string;
}
export enum DeedType {
    AgreementDeed = "AgreementDeed",
    SaleDeed = "SaleDeed"
}
export interface backendInterface {
    addLocation(location: Location): Promise<void>;
    addParty(party: Party): Promise<void>;
    addPreparer(preparer: DocumentPreparer): Promise<void>;
    deleteDraft(id: string): Promise<void>;
    deleteLocation(id: string): Promise<void>;
    deleteParty(id: string): Promise<void>;
    deletePreparer(id: string): Promise<void>;
    getAllDrafts(): Promise<Array<DeedDraft>>;
    getAllLocations(): Promise<Array<Location>>;
    getAllParties(): Promise<Array<Party>>;
    getAllPreparers(): Promise<Array<DocumentPreparer>>;
    getDraft(id: string): Promise<DeedDraft | null>;
    getLocation(id: string): Promise<Location | null>;
    getParty(id: string): Promise<Party | null>;
    getPreparer(id: string): Promise<DocumentPreparer | null>;
    saveDraft(draft: DeedDraft): Promise<void>;
    updateDraft(draft: DeedDraft): Promise<void>;
    updateLocation(location: Location): Promise<void>;
    updateParty(party: Party): Promise<void>;
    updatePreparer(preparer: DocumentPreparer): Promise<void>;
}
