export class Login {
  public username: string;
  public comments: string;
  public password: string;
  public established: string;

  constructor(username: string, comments: string, password: string, established: string) {
    this.username = username;
    this.comments = comments;
    this.password = password;
    this.established = established;
  }
}
