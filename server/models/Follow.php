<?php
class Follow
{
  private $conn;
  private $table_name = "follows";

  public $user_id;
  public $novel_id;
  public $created_at;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function follow()
  {
    $query = "INSERT INTO " . $this->table_name . "
                  SET
                    user_id=:user_id,
                    novel_id=:novel_id";

    $stmt = $this->conn->prepare($query);

    $this->user_id = htmlspecialchars(strip_tags($this->user_id));
    $this->novel_id = htmlspecialchars(strip_tags($this->novel_id));

    $stmt->bindParam(":user_id", $this->user_id);
    $stmt->bindParam(":novel_id", $this->novel_id);

    if ($stmt->execute()) {
      return true;
    }
    return false;
  }

  public function unfollow()
  {
    $query = "DELETE FROM " . $this->table_name . "
                  WHERE user_id = :user_id AND novel_id = :novel_id";

    $stmt = $this->conn->prepare($query);

    $this->user_id = htmlspecialchars(strip_tags($this->user_id));
    $this->novel_id = htmlspecialchars(strip_tags($this->novel_id));

    $stmt->bindParam(":user_id", $this->user_id);
    $stmt->bindParam(":novel_id", $this->novel_id);

    if ($stmt->execute() && $stmt->rowCount() > 0) {
      return true;
    }
    return false;
  }

  public function isFollowing()
  {
    $query = "SELECT 1 FROM " . $this->table_name . "
                  WHERE user_id = :user_id AND novel_id = :novel_id
                  LIMIT 1";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":user_id", $this->user_id);
    $stmt->bindParam(":novel_id", $this->novel_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
      return true;
    }
    return false;
  }

  public function getFollowedNovels()
  {
    $query = "SELECT
                    n.novel_id, n.title, n.cover_image_url, n.author_name, n.updated_at
                  FROM
                    " . $this->table_name . " f
                  JOIN
                    novels n ON f.novel_id = n.novel_id
                  WHERE
                    f.user_id = :user_id
                  ORDER BY
                    n.updated_at DESC";

    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(":user_id", $this->user_id);
    $stmt->execute();

    return $stmt;
  }
}
