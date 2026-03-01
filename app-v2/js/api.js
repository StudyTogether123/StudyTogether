export async function getPostById(id) {
    const res = await fetch(`http://localhost:3000/posts/${id}`);
    if (!res.ok) throw new Error("Not found");
    return res.json();
}