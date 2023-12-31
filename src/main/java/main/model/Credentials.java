package main.model;

public class Credentials {
    private String username;
    private String password;

    public Credentials(){}

    public Credentials(String username, String password){
        this.username = username;
        this.password = password;
    }

    public String getUsername(){
        return username;
    }

    public String getPassword(){
        return password;
    }

    public String toJSON(){
        return "{\"username\": \"" + username + "\", \"password\": \"" + password + "\"}";
    }
}