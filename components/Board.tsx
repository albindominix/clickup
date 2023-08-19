"use client";

import { useBoardStore } from "@/store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    getBoard();
    // console.log(board);
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result; //check video 2:07:00

    //Check if user dragged car outside of board
    if (!destination) return;

    //Handle entire column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1); //check video 2:10:00
      entries.splice(destination.index, 0, removed);
      const rearragedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearragedColumns });
    }

    //This step is needed as the indexes are stored as numbers 0,1,2,3,etc instead of id's with DnD library
    const columns = Array.from(board.columns); // check video 2:13:00

    //my own code from 39 to 56
    function findIndex(target: string) {
      let targetIndex = -1;
      for (let i = 0; i < columns.length; i++) {
        const identifier = columns[i][0];
        if (identifier === target) {
          targetIndex = i;
          break;
        }
      }
      return targetIndex;
    }

    let startIndex = findIndex(source.droppableId);
    let endIndex = findIndex(destination.droppableId);

    const startColIndex = columns[startIndex];
    const finishColIndex = columns[endIndex];

    //this was the original code,but wasnt working
    // const startColIndex = columns[Number(source.droppableId)];
    // const finishColIndex = columns[Number(source.droppableId)];

    console.log(source, finishColIndex);
    //with startCol and finsihCol we the starting and ending point check the console.log when dragging it
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;
    //Same column drag
    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      //dragging to another colum
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);

      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });
      //Update in DB
      updateTodoInDB(todoMoved, finishCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
