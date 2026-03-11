import java.util.*;

class Note {
    int id;
    String title;
    String subject;
    int likes;
    int dislikes;
    ArrayList<String> comments = new ArrayList<>();

    Note(int id, String title, String subject) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        likes = 0;
        dislikes = 0;
    }
}

class UserNode {
    String name;
    UserNode next;

    UserNode(String name) {
        this.name = name;
        next = null;
    }
}

public class ShareMyNotesSystem {

    UserNode head = null;
    ArrayList<Note> notes = new ArrayList<>();
    HashMap<Integer, Note> noteMap = new HashMap<>();
    Stack<String> uploadHistory = new Stack<>();
    Queue<String> chatQueue = new LinkedList<>();
    Scanner sc = new Scanner(System.in);

    /* ================= USER ================= */
    void addUser() {
        System.out.print("Enter name: ");
        String name = sc.nextLine();

        UserNode newNode = new UserNode(name);
        newNode.next = head;
        head = newNode;

        System.out.println("User registered successfully!");
    }

    /* ================= UPLOAD ================= */
    void uploadNote() {
        System.out.print("Enter Note ID: ");
        int id = sc.nextInt();
        sc.nextLine(); // clear newline

        System.out.print("Enter Title: ");
        String title = sc.nextLine();

        System.out.print("Enter Subject: ");
        String subject = sc.nextLine();

        Note n = new Note(id, title, subject);
        notes.add(n);
        noteMap.put(id, n);
        uploadHistory.push(title);

        System.out.println("Note uploaded successfully!");
    }

    /* ================= VIEW ================= */
    void showNotes() {
        if (notes.isEmpty()) {
            System.out.println("No notes available.");
            return;
        }

        for (Note n : notes) {
            System.out.println(n.id + " | " + n.title + " | " + n.subject +
                    " | Likes:" + n.likes +
                    " | Dislikes:" + n.dislikes);
            if (!n.comments.isEmpty()) {
                System.out.println("   Comments: " + n.comments);
            }
        }
    }

    /* ================= DOWNLOAD ================= */
    void downloadNote() {
        System.out.print("Enter Note ID: ");
        int id = sc.nextInt();
        sc.nextLine(); // clear newline

        if (noteMap.containsKey(id)) {
            Note n = noteMap.get(id);
            System.out.println("Downloading Note...");
            System.out.println("Title: " + n.title);
            System.out.println("Subject: " + n.subject);
        } else {
            System.out.println("Note not found.");
        }
    }

    /* ================= SEARCH ================= */
    void searchNote() {
        sc.nextLine(); // clear newline
        System.out.print("Enter title to search: ");
        String title = sc.nextLine();

        for (Note n : notes) {
            if (n.title.equalsIgnoreCase(title)) {
                System.out.println("Note found: " + n.title + " | Subject: " + n.subject);
                System.out.println("Likes: " + n.likes + " | Dislikes: " + n.dislikes);
                System.out.println("Comments: " + n.comments);
                return;
            }
        }
        System.out.println("Note not found.");
    }

    /* ================= LIKE ================= */
    void likeNote() {
        System.out.print("Enter Note ID: ");
        int id = sc.nextInt();
        sc.nextLine(); // clear newline

        if (noteMap.containsKey(id)) {
            noteMap.get(id).likes++;
            System.out.println("Note liked!");
        } else {
            System.out.println("Note not found.");
        }
    }

    /* ================= DISLIKE ================= */
    void dislikeNote() {
        System.out.print("Enter Note ID: ");
        int id = sc.nextInt();
        sc.nextLine(); // clear newline

        if (noteMap.containsKey(id)) {
            noteMap.get(id).dislikes++;
            System.out.println("Note disliked!");
        } else {
            System.out.println("Note not found.");
        }
    }

    /* ================= COMMENT ================= */
    void commentNote() {
        System.out.print("Enter Note ID: ");
        int id = sc.nextInt();
        sc.nextLine(); // clear newline

        if (noteMap.containsKey(id)) {
            System.out.print("Enter comment: ");
            String c = sc.nextLine();
            noteMap.get(id).comments.add(c);
            System.out.println("Comment added!");
        } else {
            System.out.println("Note not found.");
        }
    }

    /* ================= TRENDING ================= */
    void showTrending() {
        if (notes.isEmpty()) {
            System.out.println("No notes available.");
            return;
        }

        Collections.sort(notes, (a, b) -> b.likes - a.likes);

        System.out.println("Trending Notes:");
        for (Note n : notes) {
            System.out.println(n.title + " | Likes:" + n.likes);
        }
    }

    /* ================= CHAT ================= */
    void sendMessage() {
        sc.nextLine(); // clear newline
        System.out.print("Enter message: ");
        String msg = sc.nextLine();
        chatQueue.add(msg);
        System.out.println("Message sent!");
    }

    void showMessages() {
        if (chatQueue.isEmpty()) {
            System.out.println("No messages yet.");
            return;
        }

        System.out.println("Chat Messages:");
        for (String m : chatQueue) {
            System.out.println(m);
        }
    }

    /* ================= HISTORY ================= */
    void showUploadHistory() {
        if (uploadHistory.isEmpty()) {
            System.out.println("No uploads yet.");
            return;
        }

        System.out.println("Upload History:");
        for (String s : uploadHistory) {
            System.out.println(s);
        }
    }

    /* ================= MENU ================= */
    void menu() {
        while (true) {
            System.out.println("\n===== SHARE MY NOTES =====");
            System.out.println("1 Register User");
            System.out.println("2 Upload Note");
            System.out.println("3 View Notes");
            System.out.println("4 Download Note");
            System.out.println("5 Search Note");
            System.out.println("6 Like Note");
            System.out.println("7 Dislike Note");
            System.out.println("8 Comment on Note");
            System.out.println("9 Trending Notes");
            System.out.println("10 Send Message");
            System.out.println("11 Show Messages");
            System.out.println("12 Upload History");
            System.out.println("13 Exit");

            System.out.print("Enter your choice: ");
            int ch = sc.nextInt();

            switch (ch) {
                case 1: sc.nextLine(); addUser(); break;
                case 2: uploadNote(); break;
                case 3: showNotes(); break;
                case 4: downloadNote(); break;
                case 5: searchNote(); break;
                case 6: likeNote(); break;
                case 7: dislikeNote(); break;
                case 8: commentNote(); break;
                case 9: showTrending(); break;
                case 10: sendMessage(); break;
                case 11: showMessages(); break;
                case 12: showUploadHistory(); break;
                case 13: System.exit(0);
                default: System.out.println("Invalid choice");
            }
        }
    }

    public static void main(String[] args) {
        ShareMyNotesSystem app = new ShareMyNotesSystem();
        app.menu();
    }
}