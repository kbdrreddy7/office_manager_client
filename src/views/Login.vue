<template>


            <div class="align-center" >
                          <q-card class="login q-mt-xl" >                       
                        
                            <q-card-section   >
                                <div class=" align-center logo-img" >
                                   <img :src="logo"  />
                                </div>
                                <div >
                                    <q-form
                                        @submit="onSubmit"
                                        @reset="onReset"
                                        autocomplete="off"
                                        class="form  q-gutter-md"
                                      >
                                        <q-input
                                          outlined      
                                          :dense="true"                            
                                          label="User Name *"
                                          lazy-rules
                                           bottom-slots
                                          :rules="rules['user_name']"
                                          v-model="values['user_name']"
                                          :error="!!errors['user_name']"
                                          :error-message="errors['user_name']"
                                          @focus="errors['user_name']=''"

                                        >

                                                <template v-slot:append>
                                                  <q-icon
                                                    :name="'fas fa-lock'"
                                                    class="cursor-pointer"
                                                  />
                                                </template>
                                        </q-input>

                                        <q-input
                                          :dense="true"
                                          outlined
                                          :type="isPwd ? 'password' : 'text'"
                                          label="Password *"
                                          hint="minimum 6 chars"
                                          lazy-rules
                                           bottom-slots
                                          :rules="rules['password']"
                                          v-model="values['password']"
                                          :error="!!errors['password']"
                                          :error-message="errors['password']"
                                          @focus="errors['password']=''"

                                        >
                                                <template v-slot:append>
                                                  <q-icon
                                                    :name="isPwd ? 'fas fa-eye-slash' : 'fas fa-eye'"
                                                    class="cursor-pointer"
                                                    @click="isPwd = !isPwd"
                                                  />
                                                </template>

                                        </q-input>
                                        <div  >


                                               <q-btn :loading="loading" color="primary" 
                                               
                                                label="Login" type="submit"
                                                >
                                                  <template v-slot:loading>
                                                    <q-spinner-hourglass class="on-left" />
                                                  </template>
                                                </q-btn>

                                          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                                          <router-link to="#" >Forgot Password?</router-link>
                                        </div>
                                      </q-form>
                                </div>
                            </q-card-section>
                          </q-card>
                    </div>
  
   
</template>
<script>
import {validationMixin,notificationMixin} from '../mixins'
import { mapActions,/* mapGetters,mapState */ } from 'vuex'

export default {
    name:"Login",
    components:{
    },
    mixins:[validationMixin,notificationMixin],
    data(){
      return({
        logo:require("../assets/logo.png"),
        isPwd:true,

        accept: false,
        loading:false,
        values:{
            user_name:"",
            password:""
        },
        rules:{
            user_name:[this.required()],
            password:[this.required(),this.minLength(6)]
        },
        errors:{}

      })
    },

  methods: {
            ...mapActions('auth', ['login', 'logout']),

  async  onSubmit () {
          try {
            this.loading=true

            await this.login(this.values)
            this.loading=false
            this.$router.push("/home")
      } catch (error) {
        this.loading=false
        this.errors=error.errors
      }


    },

    onReset () {
        this.values={}
        this.errors={}
    }
  }

}
</script>

<style lang="scss" scoped>

 .align-center{
   display: flex;
   justify-content: center;
   align-items: center;
 }

 .logo-img img{
   max-width: 90%;
   margin-bottom: 15%;
 }
 
 
 .login .form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    label{
      width: 90%;
    }
 }

</style>
