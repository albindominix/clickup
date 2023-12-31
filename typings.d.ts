interface Board{
    columns:Map<TypedColumn,Column>
}

type TypedColumn = "todo" | "inprogress" | "done"

type Column =  {
    id:TypedColumn,
    todos:Todo[]
}

interface Todo{
    $id:string,
    $createdAt:string,
    status:TypedColumn,
    image?:Image,
    title:string
}

interface Image{
    bucketId:string,
    fileId:string
}