import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createRoom } from "../../api";
import { Button, Container, Input, Select, Loader } from "../../components";
import toast from "react-hot-toast";
import localforage from "localforage";
import { useNavigate } from "react-router";
import { NewGameFormData } from "../../interfaces";

const NewGame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const votingOptions = useMemo(
    () => [
      {
        value: "Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕)",
        label: "Fibonacci (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕)",
      },
    ],
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewGameFormData>();

  const handleRoomCreate: SubmitHandler<NewGameFormData> = async (formData) => {
    setLoading(true);
    try {
      const data = await createRoom(formData);
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      await localforage.setItem("accessToken", data.accessToken);
      navigate("/play", { replace: true });
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room. Please try again.");
    } finally {
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
              validate: (value) =>
                value.trim() !== "" ||
                "Display name cannot be empty or just spaces",
            })}
            errorMessage={errors.displayName?.message}
          />

          <Input
            label="Game's Name"
            type="text"
            className="py-3 px-md-3 rounded-3"
            {...register("gameName", {
              required: "This field is required",
              validate: (value) =>
                value.trim() !== "" ||
                "Game's name cannot be empty or just spaces",
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
