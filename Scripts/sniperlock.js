this.name               = "sniperlock";
this.author               = "CommonSenseOTB";
this.copyright            = "Copyright Dec. 17, 2011 by CommonSenseOTB, licensed under Creative Commons: attribution, non-commercial, sharealike with clauses - see readme.txt";
this.description         = "Sniperlock Script";
this.version            = "1.0";

this.startUp = function()
   {
   // You may toggle the difficulty to lock and unlock, and duration. This has applications for compensating for joysticks that drift slightly, persons with disabilities, and persons who find it difficult to keep a constant aim at a target.
   // It is possible to tweak these to suit your own capability to aim and constantly maintain that aim.
   //
   // The current settings are quite balanced and should not prove too uber.
   //
   // YOU MAY TOUCH THESE
   //
   this.sniperlockdifficultylock = 0.002;// default is 0.002, this determines how accurate you have to aim to get a lock, set lower to make it harder to get a lock, higher to make it easier to get a lock.
   this.sniperlockdifficultyunlock = 0.06;// default is 0.06, this determines how much force you have to apply to the controls to force an unlock and how large a movement the target has to make to break the lock, set lower to make it easier to unlock, higher to make it harder to unlock.
   this.sniperlockduration = 12;// default is 12, this determines how long the lock will last, set lower to make the lock time shorter, higher to make the lock time longer.
   //
   //
   //
   // DO NOT TOUCH THESE PLEASE
   //
   // OXP DEVELOPERS: deactivation switch provided for remote access by other oxps
   //
   this.deactivate = "FALSE";// default is "FALSE", scripters can deactivate this oxp by setting to "TRUE";
   //
   this.sniperlockchangeflag = "OFF";// flag to engage sniperlock control software
   this.sniperlockcounter = 0;//counter to control sniperlock time
   this.sniperlocktargetlastposition1 = "";// aim is 1 frame behind true target position
   this.sniperlocktargetlastposition2 = "";// aim is 2 frames behind true target position
   this.sniperlocktargetlastposition3 = "";// aim is 3 frames behind true target position
   }  

this.playerBoughtEquipment = function(equipmentKey)
   {     
   if(equipmentKey === ("EQ_SNIPERLOCK_REMOVAL"))
      {
      player.ship.removeEquipment("EQ_SNIPERLOCK");
      player.ship.removeEquipment("EQ_SNIPERLOCK_REMOVAL");
      player.credits += 250;
      }
   }
   
this.shipWillLaunchFromStation = function()
   {
   this.sl = addFrameCallback(this.sniperLock.bind(this));//----------   
   }

this.shipDockedWithStation = function()
   {
   removeFrameCallback(this.sl);//----------
   }
   
this.shipWillEnterWitchspace = function()
   {
   removeFrameCallback(this.sl);//----------
   }
   
this.shipExitedWitchspace = function()
   {
   this.sl = addFrameCallback(this.sniperLock.bind(this));//----------   
   }
   
this.sniperLock = function()
   {
   if((!player.ship.target) || (player.ship.equipmentStatus("EQ_SNIPERLOCK") !== "EQUIPMENT_OK") || (player.ship.equipmentStatus("EQ_SCANNER_SHOW_MISSILE_TARGET") !== "EQUIPMENT_OK") || (this.deactivate === "TRUE"))
      {
	  if(this.sniperlockchangeflag !== "OFF")
         {
	     this.sniperlocktargetlastposition1 = "";
	     this.sniperlocktargetlastposition2 = "";
	     this.sniperlocktargetlastposition3 = "";
	     this.sniperlockchangeflag = "OFF";
	     this.sniperlockcounter = 0;
		 return;
	     }
      return;
      }
   if(player.ship.target.isValid)
      {
      this.sniperlocktargetrangevalue = ((player.ship.position.distanceTo(player.ship.target.position) - player.ship.target.collisionRadius) / 1000);
	  }
   else
      {
	  this.sniperlocktargetrangevalue = 0;
	  }
   if((this.sniperlockchangeflag === "READY") && (this.sniperlocktargetrangevalue > 5.0) && (this.sniperlocktargetrangevalue < 25.6))
      {
	  if(player.ship.viewDirection === "VIEW_FORWARD")
	     {
	     let readytv = player.ship.target.position.subtract(player.ship.position).direction();
         let readya = player.ship.heading.angleTo(readytv);
	        {
		    if(readya <= this.sniperlockdifficultylock)
	           {
               this.sniperlocktargetlastposition1 = player.ship.target.position;
               this.sniperlocktargetlastposition2 = player.ship.target.position;
               this.sniperlocktargetlastposition3 = player.ship.target.position;
               this.sniperlockchangeflag = "ON";
			   }
            }
         }
      if(player.ship.viewDirection === "VIEW_AFT")
	     {
	     let readytv = player.ship.target.position.subtract(player.ship.position).direction();
         let readya = player.ship.heading.multiply(-1).angleTo(readytv);
	        {
		    if(readya <= this.sniperlockdifficultylock)
	           {
               this.sniperlocktargetlastposition1 = player.ship.target.position;
               this.sniperlocktargetlastposition2 = player.ship.target.position;
               this.sniperlocktargetlastposition3 = player.ship.target.position;
               this.sniperlockchangeflag = "ON";
			   }
            }
         }
      }
   if((this.sniperlockchangeflag === "ON") && (this.sniperlocktargetrangevalue > 5.0) && (this.sniperlocktargetrangevalue < 25.6))
      {
	  if(player.ship.viewDirection === "VIEW_FORWARD")
	     {
	     this.sniperlockcounter += 1;
	     let disengagetv = player.ship.target.position.subtract(player.ship.position).direction();
         let disengagea = player.ship.heading.angleTo(disengagetv);
		 if((disengagea > this.sniperlockdifficultyunlock) || (this.sniperlockcounter > this.sniperlockduration))
	        {
			this.sniperlocktargetlastposition1 = "";
            this.sniperlocktargetlastposition2 = "";
            this.sniperlocktargetlastposition3 = "";
            this.sniperlockchangeflag = "READY";
			this.sniperlockcounter = 0;
			return;
            }
         let tv = this.sniperlocktargetlastposition3.subtract(player.ship.position).direction();
         let a = player.ship.heading.angleTo(tv);
         let cr = player.ship.heading.cross(tv).direction();
         player.ship.orientation = player.ship.orientation.rotate(cr,-a);
         this.sniperlocktargetlastposition3 = this.sniperlocktargetlastposition2;
         this.sniperlocktargetlastposition2 = this.sniperlocktargetlastposition1;
	     this.sniperlocktargetlastposition1 = player.ship.target.position;
		 }
      if(player.ship.viewDirection === "VIEW_AFT")
	     {
	     this.sniperlockcounter += 1;
	     let disengagetv = player.ship.target.position.subtract(player.ship.position).direction();
         let disengagea = player.ship.heading.multiply(-1).angleTo(disengagetv);
		 if((disengagea > this.sniperlockdifficultyunlock) || (this.sniperlockcounter > this.sniperlockduration))
	        {
			this.sniperlocktargetlastposition1 = "";
            this.sniperlocktargetlastposition2 = "";
            this.sniperlocktargetlastposition3 = "";
            this.sniperlockchangeflag = "READY";
			this.sniperlockcounter = 0;
			return;
            }
         let tv = this.sniperlocktargetlastposition3.subtract(player.ship.position).direction();
         let a = player.ship.heading.multiply(-1).angleTo(tv);
         let cr = player.ship.heading.multiply(-1).cross(tv).direction();
         player.ship.orientation = player.ship.orientation.rotate(cr,-a);
         this.sniperlocktargetlastposition3 = this.sniperlocktargetlastposition2;
         this.sniperlocktargetlastposition2 = this.sniperlocktargetlastposition1;
	     this.sniperlocktargetlastposition1 = player.ship.target.position;
		 }
      }
   if((this.sniperlockchangeflag === "ON") && (this.sniperlocktargetrangevalue <= 5.0))
      {
	  this.sniperlocktargetlastposition1 = "";
      this.sniperlocktargetlastposition2 = "";
      this.sniperlocktargetlastposition3 = "";
      this.sniperlockchangeflag = "READY";
	  this.sniperlockcounter = 0;
      }
   }
   
this.shipTargetAcquired = function()
   {
   if(this.deactivate === "FALSE")
      {
      this.sniperlocktargetlastposition1 = "";
      this.sniperlocktargetlastposition2 = "";
      this.sniperlocktargetlastposition3 = "";
      this.sniperlockchangeflag = "READY";
      this.sniperlockcounter = 0;
	  }
   }

this.shipDied = function()
   {
   removeFrameCallback(this.sl);//----------
   }	  
