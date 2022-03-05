export class EmployeeUrl {

    constructor(
        public Id: string, 
        public EmployeeName: string, 
        public StarTimeUtc: string, 
        public EndTimeUtc: string,
        public EntryNotes: string,
        public DeletedOn: string) { }

}