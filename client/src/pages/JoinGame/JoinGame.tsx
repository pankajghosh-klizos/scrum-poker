import { useNavigate, useParams } from "react-router";
import { Button, Container, Input, Loader } from "../../components";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import localforage from "localforage";
import { joinRoom } from "../../api";
import { JoinGameFormData } from "../../interfaces";

const JoinGame = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinGameFormData>();

  const handleRoomJoin: SubmitHandler<JoinGameFormData> = async (formData) => {
    setLoading(true);
    try {
      const res = await joinRoom(roomId, formData);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      await localforage.setItem("accessToken", res.data.accessToken);
      navigate("/play", { replace: true });
    } catch (error) {
      console.error("Failed to join room:", error);
      toast.error("Failed to join room. Please try again.");
    } finally {
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
