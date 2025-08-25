<?php
class Chapter
{
    private $conn;
    private $table_name = "chapters";

    public $novel_id;
    public $chapter_number;
    public $title;
    public $content;
    public $created_at;
    public $updated_at;

    public $novel_title;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function readByNovelId()
    {
        $query = "SELECT
                    c.novel_id, c.chapter_number,
                    c.title, c.created_at, c.updated_at
                  FROM
                    " . $this->table_name . " c
                  WHERE
                    c.novel_id = :novel_id
                  ORDER BY
                    c.chapter_number ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":novel_id", $this->novel_id);
        $stmt->execute();

        return $stmt;
    }

    public function readOne()
    {
        $query = "SELECT
                    c.*,
                    n.title as novel_title
                  FROM
                    " . $this->table_name . " c
                  LEFT JOIN
                    novels n ON c.novel_id = n.novel_id
                  WHERE
                    c.novel_id = :novel_id AND c.chapter_number = :chapter_number
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":novel_id", $this->novel_id);
        $stmt->bindParam(":chapter_number", $this->chapter_number);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->novel_id = $row['novel_id'];
            $this->chapter_number = $row['chapter_number'];
            $this->title = $row['title'];
            $this->content = $row['content'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            $this->novel_title = $row['novel_title'];

            $query_update_view = "UPDATE novels SET view_count = view_count + 1 WHERE novel_id = :novel_id";
            $stmt_update = $this->conn->prepare($query_update_view);
            $stmt_update->bindParam(":novel_id", $this->novel_id);
            $stmt_update->execute();

            return true;
        }

        return false; // คืนค่า false เมื่อไม่เจอ
    }

    public function create()
    {
        $this->conn->beginTransaction();

        try {
            $query = "INSERT INTO " . $this->table_name . "
                      SET
                        novel_id=:novel_id,
                        chapter_number=:chapter_number,
                        title=:title,
                        content=:content";

            $stmt = $this->conn->prepare($query);

            $this->novel_id = htmlspecialchars(strip_tags($this->novel_id));
            $this->chapter_number = htmlspecialchars(strip_tags($this->chapter_number));
            $this->title = htmlspecialchars(strip_tags($this->title));

            $stmt->bindParam(":novel_id", $this->novel_id);
            $stmt->bindParam(":chapter_number", $this->chapter_number);
            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":content", $this->content);

            $stmt->execute();

            $query_novel = "UPDATE novels SET updated_at = CURRENT_TIMESTAMP WHERE novel_id = :novel_id";
            $stmt_novel = $this->conn->prepare($query_novel);
            $stmt_novel->bindParam(":novel_id", $this->novel_id);
            $stmt_novel->execute();

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function update()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET
                    title = :title,
                    content = :content
                  WHERE
                    novel_id = :novel_id AND chapter_number = :chapter_number";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->novel_id = htmlspecialchars(strip_tags($this->novel_id));
        $this->chapter_number = htmlspecialchars(strip_tags($this->chapter_number));

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':content', $this->content);
        $stmt->bindParam(':novel_id', $this->novel_id);
        $stmt->bindParam(':chapter_number', $this->chapter_number);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE novel_id = :novel_id AND chapter_number = :chapter_number";

        $stmt = $this->conn->prepare($query);

        $this->novel_id = htmlspecialchars(strip_tags($this->novel_id));
        $this->chapter_number = htmlspecialchars(strip_tags($this->chapter_number));

        $stmt->bindParam(':novel_id', $this->novel_id);
        $stmt->bindParam(':chapter_number', $this->chapter_number);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                return true;
            }
        }
        return false;
    }
}
