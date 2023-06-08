import { useAdminAcceptInvite } from "medusa-react"
import qs from "qs"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { decodeToken } from "react-jwt"
import { useLocation, useNavigate } from "react-router-dom"
import InputError from "../components/atoms/input-error"
import Button from "../components/fundamentals/button"
import SigninInput from "../components/molecules/input-signin"
import SEO from "../components/seo"
import PublicLayout from "../components/templates/login-layout"
import useNotification from "../hooks/use-notification"
import { getErrorMessage } from "../utils/error-messages"
import FormValidator from "../utils/form-validator"

type FormValues = {
  password: string
  repeat_password: string
  first_name: string
  last_name: string
}

const InvitePage = () => {
  const location = useLocation()
  const parsed = qs.parse(location.search.substring(1))
  const [signUp, setSignUp] = useState(false)

  let token: Object | null = null
  if (parsed?.token) {
    try {
      token = decodeToken(parsed.token as string)
    } catch (e) {
      token = null
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
    },
  })

  const { mutate, isLoading } = useAdminAcceptInvite()
  const navigate = useNavigate()
  const notification = useNotification()

  const handleAcceptInvite = handleSubmit((data: FormValues) => {
    if (data.password !== data.repeat_password) {
      setError(
        "repeat_password",
        {
          type: "manual",
          message: "Paroolid ei ühti",
        },
        {
          shouldFocus: true,
        }
      )

      return
    }

    mutate(
      {
        token: parsed.token as string,
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        },
      },
      {
        onSuccess: () => {
          navigate("/login")
        },
        onError: (err) => {
          notification("Viga", getErrorMessage(err), "error")
        },
      }
    )
  })

  if (!token) {
    return (
      <PublicLayout>
        <SEO title="Loo konto" />
        <div className="gap-y-xsmall flex flex-col items-center">
          <h1 className="inter-xlarge-semibold mb- text-[20px]">
           Kehtetu kutse
          </h1>
          <p className="inter-base-regular text-grey-50 w-[280px] text-center">
            Teie kasutatud kutselink on kehtetu. Võtke ühendust oma administraatoriga.
          </p>
          <p className="inter-small-regular text-grey-40 mt-xlarge">
            On juba konto? <a href="/login">Logi sisse</a>
          </p>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <SEO title="Loo konto" />
      {signUp ? (
        <form onSubmit={handleAcceptInvite}>
          <div className="flex flex-col items-center">
            <h1 className="inter-xlarge-semibold mb-large text-[20px]">
              Looge oma Medusa konto
            </h1>
            <div className="gap-y-small flex flex-col">
              <div>
                <SigninInput
                  placeholder="Eesnimi"
                  {...register("first_name", {
                    required: FormValidator.required("Eesnimi"),
                  })}
                  autoComplete="given-name"
                />
                <InputError errors={errors} name="first_name" />
              </div>
              <div>
                <SigninInput
                  placeholder="Perekonnanimi"
                  {...register("last_name", {
                    required: FormValidator.required("Perekonnanimi"),
                  })}
                  autoComplete="family-name"
                />
                <InputError errors={errors} name="last_name" />
              </div>
              <div>
                <SigninInput
                  placeholder="Parool"
                  type={"password"}
                  {...register("password", {
                    required: FormValidator.required("Parool"),
                  })}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <SigninInput
                  placeholder="Kinnita parool"
                  type={"password"}
                  {...register("repeat_password", {
                    required: "Pead oma parooli kinnitama",
                  })}
                  autoComplete="new-password"
                />
                <InputError errors={errors} name="repeat_password" />
              </div>
            </div>
            <Button
              variant="secondary"
              size="medium"
              className="mt-large w-[280px]"
              loading={isLoading}
            >
              Loo konto
            </Button>
            <p className="inter-small-regular text-grey-50 mt-xlarge">
              Kas olete juba registreerunud? <a href="/login">Logi sisse</a>
            </p>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center text-center">
          <h1 className="inter-xlarge-semibold text-[20px]">
            Teid on kutsutud meeskonnaga liituma
          </h1>
          <p className="inter-base-regular text-grey-50 mt-xsmall">
            Nüüd saate meeskonnaga liituda. Registreeruge allpool ja alustage
            <br />
            kohe oma Medusa kontoga.
          </p>
          <Button
            variant="secondary"
            size="medium"
            className="mt-xlarge w-[280px]"
            onClick={() => setSignUp(true)}
          >
            Registreeri
          </Button>
        </div>
      )}
    </PublicLayout>
  )
}

export default InvitePage
