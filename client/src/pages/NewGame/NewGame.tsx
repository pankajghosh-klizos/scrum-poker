import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createRoom } from "../../api";
import { Button, Container, Input, Select, Loader } from "../../components";
import toast from "react-hot-toast";
import localforage from "localforage";
import { useDispatch } from "react-redux";
import { setRoom } from "../../store/slices/room.slice";
import { useNavigate } from "react-router";
import { setParticipant } from "../../store/slices/participant.slice";

interface FormData {
  displayName: string;
  gameName: string;
  votingSystem: string;
}

const NewGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const votingOptions = [
    {
      value: "Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕)",
      label: "Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕)",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleRoomCreate: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true);

      // Call the API
      const response = await createRoom(formData);

      // Validate the response
      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Error while creating room.");
        return;
      }

      // Extract necessary data
      const { accessToken, room } = response.data.data;

      // Save token and update state
      await localforage.setItem("accessToken", accessToken);
      dispatch(setRoom(room));

      const currentParticipant =
        room.participants[room.participants.length - 1];
      dispatch(setParticipant(currentParticipant));

      // Navigate to the room
      navigate(`/room/${room?.roomId}`, { replace: true });
      toast.success(`Welcome! ${currentParticipant?.displayName}`);
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error creating room:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  return (
    <Container>
      <div
        className="d-flex w-100 align-items-center justify-content-center"
        style={{ minHeight: "70vh" }}
      >
        <form
          onSubmit={handleSubmit(handleRoomCreate)}
          className="w-100 d-flex flex-column gap-4"
          style={{ maxWidth: "700px" }}
        >
          <Input
            label="Your Display Name"
            type="text"
            className="py-3 px-md-3 rounded-3"
            {...register("displayName", {
              required: "This field is required",
              pattern: {
                value: /^[^\s]+$/,
                message: "Display name cannot contain spaces",
              },
            })}
            errorMessage={errors.displayName?.message}
          />

          <Input
            label="Game's Name"
            type="text"
            className="py-3 px-md-3 rounded-3"
            {...register("gameName", {
              required: "This field is required",
              pattern: {
                value: /^[^\s]+$/,
                message: "Game's name cannot contain spaces",
              },
            })}
            errorMessage={errors.gameName?.message}
          />

          <Select
            label="Voting System"
            options={votingOptions}
            placeholder="Select a voting system"
            className="py-3 px-md-3 rounded-3"
            {...register("votingSystem", {
              required: "Please select a voting system",
            })}
            errorMessage={errors.votingSystem?.message}
          />

          <Button
            type="submit"
            className="btn-primary mt-2 py-3 rounded-3 d-flex gap-3 align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? <Loader size="small" /> : "Start Game"}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default NewGame;
