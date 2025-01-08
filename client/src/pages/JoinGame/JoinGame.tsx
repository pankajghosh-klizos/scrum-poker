import { useNavigate, useParams } from "react-router";
import { Button, Container, Input, Loader } from "../../components";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import localforage from "localforage";
import { joinRoom } from "../../api";

interface FormData {
  displayName: string;
}

const JoinGame = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleRoomJoin: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true);

      // Call the API
      const response = await joinRoom(roomId, formData);

      // Validate the response
      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Error while joining room.");
        return;
      }

      // Extract necessary data
      const { accessToken } = response.data.data;

      // Save token and update state
      await localforage.setItem("accessToken", accessToken);

      // Navigate to the room
      navigate("/play", { replace: true });
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error joining room:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkRoomStatus = async () => {
      const accessToken = await localforage.getItem<string>("accessToken");
      if (accessToken) {
        navigate("/play", { replace: true });
      }
    };

    checkRoomStatus();
  }, []);

  return (
    <Container>
      <div
        className="d-flex w-100 align-items-center justify-content-center"
        style={{ minHeight: "70vh" }}
      >
        <form
          onSubmit={handleSubmit(handleRoomJoin)}
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

export default JoinGame;
