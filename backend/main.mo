import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  // Party Record
  type Party = {
    id : Text;
    name : Text;
    aadhaar : Text;
    mobile : Text;
    address : Text;
    relationship : Text;
  };

  module Party {
    public func compareByName(p1 : Party, p2 : Party) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  // Location/Sub-registrar Office Record
  type Location = {
    id : Text;
    officeName : Text;
    district : Text;
    taluk : Text;
    village : Text;
  };

  module Location {
    public func compareByOfficeName(l1 : Location, l2 : Location) : Order.Order {
      Text.compare(l1.officeName, l2.officeName);
    };
  };

  // Document Preparer Record
  type DocumentPreparer = {
    id : Text;
    name : Text;
    office : Text;
    mobile : Text;
  };

  module DocumentPreparer {
    public func compareByName(dp1 : DocumentPreparer, dp2 : DocumentPreparer) : Order.Order {
      Text.compare(dp1.name, dp2.name);
    };
  };

  // Deed Draft Record
  type DeedType = {
    #SaleDeed;
    #AgreementDeed;
  };

  type DeedDraft = {
    id : Text;
    deedType : DeedType;
    createdAt : Int;
    updatedAt : Int;
    formData : Text; // Serialized JSON blob
  };

  // Persistent Maps
  let partyMap = Map.empty<Text, Party>();
  let locationMap = Map.empty<Text, Location>();
  let preparerMap = Map.empty<Text, DocumentPreparer>();
  let draftMap = Map.empty<Text, DeedDraft>();

  // CRUD Operations for Party
  public shared ({ caller }) func addParty(party : Party) : async () {
    partyMap.add(party.id, party);
  };

  public shared ({ caller }) func updateParty(party : Party) : async () {
    if (not partyMap.containsKey(party.id)) {
      Runtime.trap("Party not found");
    };
    partyMap.add(party.id, party);
  };

  public shared ({ caller }) func deleteParty(id : Text) : async () {
    partyMap.remove(id);
  };

  public query ({ caller }) func getParty(id : Text) : async ?Party {
    partyMap.get(id);
  };

  public query ({ caller }) func getAllParties() : async [Party] {
    partyMap.values().toArray().sort(Party.compareByName);
  };

  // CRUD Operations for Location
  public shared ({ caller }) func addLocation(location : Location) : async () {
    locationMap.add(location.id, location);
  };

  public shared ({ caller }) func updateLocation(location : Location) : async () {
    if (not locationMap.containsKey(location.id)) {
      Runtime.trap("Location not found");
    };
    locationMap.add(location.id, location);
  };

  public shared ({ caller }) func deleteLocation(id : Text) : async () {
    locationMap.remove(id);
  };

  public query ({ caller }) func getLocation(id : Text) : async ?Location {
    locationMap.get(id);
  };

  public query ({ caller }) func getAllLocations() : async [Location] {
    locationMap.values().toArray().sort(Location.compareByOfficeName);
  };

  // CRUD Operations for Document Preparer
  public shared ({ caller }) func addPreparer(preparer : DocumentPreparer) : async () {
    preparerMap.add(preparer.id, preparer);
  };

  public shared ({ caller }) func updatePreparer(preparer : DocumentPreparer) : async () {
    if (not preparerMap.containsKey(preparer.id)) {
      Runtime.trap("Preparer not found");
    };
    preparerMap.add(preparer.id, preparer);
  };

  public shared ({ caller }) func deletePreparer(id : Text) : async () {
    preparerMap.remove(id);
  };

  public query ({ caller }) func getPreparer(id : Text) : async ?DocumentPreparer {
    preparerMap.get(id);
  };

  public query ({ caller }) func getAllPreparers() : async [DocumentPreparer] {
    preparerMap.values().toArray().sort(DocumentPreparer.compareByName);
  };

  // CRUD Operations for Deed Drafts
  public shared ({ caller }) func saveDraft(draft : DeedDraft) : async () {
    draftMap.add(draft.id, draft);
  };

  public shared ({ caller }) func updateDraft(draft : DeedDraft) : async () {
    if (not draftMap.containsKey(draft.id)) {
      Runtime.trap("Draft not found");
    };
    draftMap.add(draft.id, draft);
  };

  public shared ({ caller }) func deleteDraft(id : Text) : async () {
    draftMap.remove(id);
  };

  public query ({ caller }) func getDraft(id : Text) : async ?DeedDraft {
    draftMap.get(id);
  };

  public query ({ caller }) func getAllDrafts() : async [DeedDraft] {
    draftMap.values().toArray();
  };
};
