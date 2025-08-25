<?php
class User
{
    private $conn;
    private $table_name = "users";

    public $user_id;
    public $firstname;
    public $lastname;
    public $email;
    public $password;
    public $display_name;
    public $role;
    public $status;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "SELECT user_id, firstname, lastname, email, display_name, role, status, created_at FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function register()
    {
        $query = "INSERT INTO " . $this->table_name . "
                  SET
                    firstname=:firstname,
                    lastname=:lastname,
                    email=:email,
                    password=:password,
                    display_name=:display_name";

        $stmt = $this->conn->prepare($query);

        $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->display_name = htmlspecialchars(strip_tags($this->display_name));

        $this->password = password_hash($this->password, PASSWORD_BCRYPT);

        $stmt->bindParam(":firstname", $this->firstname);
        $stmt->bindParam(":lastname", $this->lastname);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":display_name", $this->display_name);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function emailExists()
    {
        $query = "SELECT user_id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }
        return false;
    }

    public function login()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email AND status = 1 LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();   

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && password_verify($this->password, $row['password'])) {
            $this->user_id = $row['user_id'];
            $this->firstname = $row['firstname'];
            $this->lastname = $row['lastname'];
            $this->display_name = $row['display_name'];
            $this->role = $row['role'];
            $this->status = $row['status'];
            return true;
        }
        return false;
    }

    public function readOne()
    {
        // Fix: Select all the required columns
        $query = "SELECT
                user_id, firstname, lastname, email, display_name, created_at
              FROM
                " . $this->table_name . "
              WHERE
                user_id = :user_id
              LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            // Now all keys will exist in the $row array
            $this->user_id = $row['user_id']; // Also good to set the ID
            $this->firstname = $row['firstname'];
            $this->lastname = $row['lastname'];
            $this->email = $row['email'];
            $this->display_name = $row['display_name'];
            $this->created_at = $row['created_at'];
        }
    }

    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET
                    firstname = :firstname,
                    lastname = :lastname,
                    display_name = :display_name
                  WHERE user_id = :user_id";

        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->firstname = htmlspecialchars(strip_tags($this->firstname));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->display_name = htmlspecialchars(strip_tags($this->display_name));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        // Bind parameters
        $stmt->bindParam(':firstname', $this->firstname);
        $stmt->bindParam(':lastname', $this->lastname);
        $stmt->bindParam(':display_name', $this->display_name);
        $stmt->bindParam(':user_id', $this->user_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateRole()
    {
        $query = "UPDATE " . $this->table_name . " SET role = :role WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        // Bind parameters
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':user_id', $this->user_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateStatus()
    {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        // Sanitize data
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));

        // Bind parameters
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':user_id', $this->user_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

}
